"""User management, provisioning, and profile update service."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.models.user import User


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    """Retrieve a user by primary key UUID."""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_google_sub(db: AsyncSession, google_sub: str) -> User | None:
    """Retrieve a user by Google provider subject identifier."""
    result = await db.execute(select(User).where(User.google_sub == google_sub))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Retrieve a user by email address."""
    result = await db.execute(select(User).where(User.email == email.lower().strip()))
    return result.scalar_one_or_none()


async def provision_google_user(
    db: AsyncSession,
    google_sub: str,
    email: str,
    name: str,
    avatar_url: str | None = None,
) -> User:
    """Safely provision or update a user upon successful Google OAuth authentication.
    
    Ensures idempotency, prevents duplicate account creation, and updates login timestamps.
    """
    clean_email = email.lower().strip()
    now = datetime.now(timezone.utc)

    # 1. Lookup by Google stable subject identifier
    user = await get_user_by_google_sub(db, google_sub)

    if user is not None:
        # Existing account: update profile attributes and last login timestamp
        user.name = name or user.name
        if avatar_url:
            user.avatar_url = avatar_url
        user.last_login_at = now
        user.updated_at = now
        await db.commit()
        await db.refresh(user)
        logger.info(f"Existing user logged in: {user.email} (id={user.id})")
        return user

    # 2. Check if an account already exists with this verified email
    user_by_email = await get_user_by_email(db, clean_email)
    if user_by_email is not None:
        # Link Google Subject ID to existing email account
        user_by_email.google_sub = google_sub
        user_by_email.name = name or user_by_email.name
        if avatar_url:
            user_by_email.avatar_url = avatar_url
        user_by_email.last_login_at = now
        user_by_email.updated_at = now
        await db.commit()
        await db.refresh(user_by_email)
        logger.info(f"Linked Google account to existing user: {user_by_email.email}")
        return user_by_email

    # 3. Create new user account on first login
    new_user = User(
        id=uuid.uuid4(),
        email=clean_email,
        name=name or clean_email.split("@")[0],
        avatar_url=avatar_url,
        google_sub=google_sub,
        role="candidate",
        current_tier="free",
        is_active=True,
        created_at=now,
        updated_at=now,
        last_login_at=now,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    logger.info(f"Provisioned new user account on first login: {new_user.email} (id={new_user.id})")
    return new_user


async def update_user_profile(
    db: AsyncSession,
    user: User,
    name: str | None = None,
) -> User:
    """Update editable profile fields for an authenticated user."""
    now = datetime.now(timezone.utc)
    if name is not None and name.strip():
        user.name = name.strip()
    user.updated_at = now
    await db.commit()
    await db.refresh(user)
    return user
