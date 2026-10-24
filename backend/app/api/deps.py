"""Authentication dependencies and request context guards."""

import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import AuthenticationError, decode_access_token
from app.models.user import User
from app.services.user_service import get_user_by_google_sub, get_user_by_id

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Validate Bearer JWT token and inject the authenticated database user.
    
    Raises:
        HTTPException 401: If token is missing, invalid, expired, or has wrong claims.
        HTTPException 403: If user account is marked inactive.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(credentials.credentials)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=exc.message,
            headers={"WWW-Authenticate": "Bearer"},
        )

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject identifier is missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Subject can be user UUID string or google_sub
    user: User | None = None
    try:
        user_uuid = uuid.UUID(subject)
        user = await get_user_by_id(db, user_uuid)
    except (ValueError, AttributeError):
        # Subject is google_sub
        user = await get_user_by_google_sub(db, str(subject))

    # Also fallback to google_sub claim if present
    if user is None and "google_sub" in payload:
        user = await get_user_by_google_sub(db, str(payload["google_sub"]))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token does not exist.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    return user
