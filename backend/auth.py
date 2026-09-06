"""Single-user password and session management for the data management area."""

import hashlib
import hmac
import secrets
import sqlite3
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, Request, Response, status

from backend.database import DB_PATH, db_connection, utc_now


SESSION_COOKIE = "photolens_session"
SESSION_TTL = timedelta(days=7)
MAX_ATTEMPTS = 5
LOCK_SECONDS = 900
SCRYPT_N = 2 ** 14
SCRYPT_R = 8
SCRYPT_P = 1


class AuthManager:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self._attempts: list[float] = []

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=30)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    @property
    def configured(self) -> bool:
        with db_connection() as conn:
            row = conn.execute("SELECT 1 FROM auth_config WHERE id = 1").fetchone()
            return row is not None

    def hash_password(self, password: str) -> str:
        salt = secrets.token_bytes(16)
        digest = hashlib.scrypt(
            password.encode("utf-8"), salt=salt, n=SCRYPT_N, r=SCRYPT_R,
            p=SCRYPT_P, dklen=32,
        )
        return f"scrypt${SCRYPT_N}${SCRYPT_R}${SCRYPT_P}${salt.hex()}${digest.hex()}"

    def verify_password(self, password: str, encoded: str) -> bool:
        try:
            algorithm, n, r, p, salt_hex, digest_hex = encoded.split("$")
            if algorithm != "scrypt":
                return False
            digest = hashlib.scrypt(
                password.encode("utf-8"), salt=bytes.fromhex(salt_hex),
                n=int(n), r=int(r), p=int(p), dklen=32,
            )
            return hmac.compare_digest(digest.hex(), digest_hex)
        except (ValueError, TypeError):
            return False

    def setup_password(self, password: str) -> None:
        if len(password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters.",
            )
        now = utc_now()
        with db_connection() as conn:
            row = conn.execute("SELECT 1 FROM auth_config WHERE id = 1").fetchone()
            if row:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="The management password is already configured.",
                )
            conn.execute("""
                INSERT INTO auth_config (id, password_hash, created_at, updated_at)
                VALUES (1, ?, ?, ?)
            """, (self.hash_password(password), now, now))

    def _is_locked(self) -> bool:
        self._attempts = [stamp for stamp in self._attempts if stamp > time.time() - LOCK_SECONDS]
        return len(self._attempts) >= MAX_ATTEMPTS

    def _record_failure(self) -> None:
        self._attempts.append(time.time())

    def login(self, password: str, response: Response) -> None:
        if self._is_locked():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed attempts. Try again later.",
            )
        with self._connect() as conn:
            row = conn.execute(
                "SELECT password_hash FROM auth_config WHERE id = 1"
            ).fetchone()
        if not row or not self.verify_password(password, row["password_hash"]):
            self._record_failure()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect management password.",
            )
        self._attempts.clear()
        self._create_session(response)

    def _create_session(self, response: Response) -> None:
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        expires_at = (datetime.now(timezone.utc) + SESSION_TTL).isoformat(timespec="seconds")
        with db_connection() as conn:
            conn.execute("""
                INSERT INTO sessions (token_hash, created_at, expires_at, last_seen_at)
                VALUES (?, ?, ?, ?)
            """, (token_hash, utc_now(), expires_at, utc_now()))
        response.set_cookie(
            key=SESSION_COOKIE,
            value=token,
            max_age=int(SESSION_TTL.total_seconds()),
            httponly=True,
            samesite="strict",
            path="/",
        )

    def current_session(self, request: Request) -> Optional[sqlite3.Row]:
        token = request.cookies.get(SESSION_COOKIE)
        if not token:
            return None
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with db_connection() as conn:
            row = conn.execute("""
                SELECT id, token_hash, expires_at
                FROM sessions
                WHERE token_hash = ? AND expires_at > ?
            """, (token_hash, utc_now())).fetchone()
        if row:
            with db_connection() as conn:
                conn.execute(
                    "UPDATE sessions SET last_seen_at = ? WHERE id = ?",
                    (utc_now(), row["id"]),
                )
        return row

    def is_authenticated(self, request: Request) -> bool:
        return self.current_session(request) is not None

    def logout(self, token: Optional[str], response: Response) -> None:
        if token:
            token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
            with db_connection() as conn:
                conn.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash,))
        response.delete_cookie(SESSION_COOKIE, path="/")

    def change_password(self, current_password: str, new_password: str,
                        request: Request, response: Response) -> None:
        current = self.current_session(request)
        if not current:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Login required.",
            )
        with db_connection() as conn:
            row = conn.execute(
                "SELECT password_hash FROM auth_config WHERE id = 1"
            ).fetchone()
        if not row or not self.verify_password(current_password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect.",
            )
        if len(new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be at least 8 characters.",
            )
        now = utc_now()
        with db_connection() as conn:
            conn.execute(
                "UPDATE auth_config SET password_hash = ?, updated_at = ? WHERE id = 1",
                (self.hash_password(new_password), now),
            )
            conn.execute("DELETE FROM sessions WHERE token_hash != ?", (current["token_hash"],))
        response.set_cookie(
            key=SESSION_COOKIE,
            value=request.cookies.get(SESSION_COOKIE, ""),
            max_age=int(SESSION_TTL.total_seconds()),
            httponly=True,
            samesite="strict",
            path="/",
        )
