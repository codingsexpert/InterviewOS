"""Authentication token exchange and Google OAuth provisioning endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.user import TokenExchangeRequest, TokenExchangeResponse, UserResponse
from app.services.user_service import provision_google_user

router = APIRouter()


@router.post(
    "/google",
    response_model=TokenExchangeResponse,
    status_code=status.HTTP_200_OK,
    summary="Exchange Google Identity for Application Session",
    description="Synchronize a verified Google account, provision new users on first login, and issue an application JWT.",
)
async def exchange_google_token(
    payload: TokenExchangeRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenExchangeResponse:
    """Provision user and issue signed application token."""
    user = await provision_google_user(
        db=db,
        google_sub=payload.google_sub,
        email=payload.email,
        name=payload.name,
        avatar_url=payload.avatar_url,
    )

    # Issue application JWT signed with AUTH_SECRET
    token = create_access_token(
        subject=str(user.id),
        claims={
            "email": user.email,
            "name": user.name,
            "google_sub": user.google_sub,
            "role": user.role,
        },
    )

    return TokenExchangeResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )
