#!/usr/bin/env python3
"""
Seed script to create an admin user with specified credentials.

Usage:
    cd app/backend && python seed_admin_user.py

Admin credentials:
    - Login: admin
    - Password: admin12345
    - Email: aromaty1000@gmail.com
"""

import asyncio
import hashlib
import secrets
import sys
from datetime import datetime, timezone

from core.database import db_manager
from models.auth import User
from sqlalchemy import select


def generate_salt() -> str:
    """Generate a secure random salt."""
    return secrets.token_hex(32)


def hash_password(password: str, salt: str) -> str:
    """Hash a password with salt using PBKDF2-SHA256."""
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,  # iterations
    )
    return key.hex()


async def seed_admin_user():
    """Create admin user with specified credentials."""
    print("Starting admin user seeding...")

    # Admin credentials
    admin_id = "admin"
    admin_login = "admin"
    admin_email = "aromaty1000@gmail.com"
    admin_password = "admin12345"

    # Generate password hash
    salt = generate_salt()
    password_hash = hash_password(admin_password, salt)
    password_hash_with_salt = f"{salt}:{password_hash}"

    print(f"Generated password hash for admin user")

    # Ensure database is initialized
    await db_manager.init_db()

    async with db_manager.async_session_maker() as db:
        # Check if admin user already exists
        result = await db.execute(select(User).where(User.id == admin_id))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            print(f"Admin user with ID '{admin_id}' already exists.")
            print(f"  - Current email: {existing_user.email}")
            print(f"  - Current login: {existing_user.login}")
            print(f"  - Current role: {existing_user.role}")

            # Update the existing user with new credentials
            existing_user.login = admin_login
            existing_user.email = admin_email
            existing_user.password_hash = password_hash_with_salt
            existing_user.name = admin_login
            existing_user.role = "admin"

            await db.commit()
            await db.refresh(existing_user)
            print(f"\nAdmin user updated with new credentials!")
        else:
            # Create new admin user
            admin_user = User(
                id=admin_id,
                email=admin_email,
                login=admin_login,
                name=admin_login,
                role="admin",
                password_hash=password_hash_with_salt,
                last_login=None,
            )
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
            print(f"\nAdmin user created successfully!")

        print(f"\nAdmin User Details:")
        print(f"  - ID: {admin_id}")
        print(f"  - Login: {admin_login}")
        print(f"  - Email: {admin_email}")
        print(f"  - Password: {admin_password}")
        print(f"  - Role: admin")

    print("\nSeeding completed!")


if __name__ == "__main__":
    try:
        asyncio.run(seed_admin_user())
    except Exception as e:
        print(f"Error seeding admin user: {e}", file=sys.stderr)
        sys.exit(1)