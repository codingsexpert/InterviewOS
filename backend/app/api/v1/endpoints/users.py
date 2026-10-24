"""User profile management endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import update_user_profile

router = APIRouter()


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Retrieve the authenticated candidate or recruiter profile information.",
)
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """Return the profile for the currently authenticated user."""
    return current_user


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update Profile Information",
    description="Update editable profile attributes (e.g. display name) for the authenticated user.",
)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Update editable profile fields for the authenticated user."""
    updated_user = await update_user_profile(db=db, user=current_user, name=payload.name)
    return updated_user
