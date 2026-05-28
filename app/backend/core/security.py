import hashlib
import secrets


def verify_password(plain_password: str, password_hash_with_salt: str) -> bool:
    """Verify a password against a salted PBKDF2-SHA256 hash.

    The stored hash format is ``salt:hash`` where both parts are hex-encoded.
    """
    if not plain_password or not password_hash_with_salt:
        return False
    try:
        salt, expected_hash = password_hash_with_salt.split(":", 1)
    except ValueError:
        return False
    key = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    )
    return key.hex() == expected_hash


def hash_password(password: str) -> str:
    """Hash a password with a random salt using PBKDF2-SHA256.

    Returns ``salt:hash``.
    """
    salt = secrets.token_hex(32)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    )
    return f"{salt}:{key.hex()}"
