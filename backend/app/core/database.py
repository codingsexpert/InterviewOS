"""Database engine, session management, and connectivity diagnostics."""

from typing import AsyncGenerator, Tuple
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.core.config import settings
from app.core.logging import logger

engine: AsyncEngine | None = None
AsyncSessionLocal: async_sessionmaker[AsyncSession] | None = None

if settings.DATABASE_URL:
    try:
        engine = create_async_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            future=True,
            echo=False,
        )
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
        logger.info("SQLAlchemy async engine initialized successfully.")
    except Exception as exc:
        logger.error(f"Failed to initialize SQLAlchemy engine: {exc}")
else:
    logger.warning("DATABASE_URL is not set. Database features are currently disabled.")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional asynchronous database session."""
    if AsyncSessionLocal is None:
        raise RuntimeError("Database is not configured. DATABASE_URL is required.")
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_db_connectivity() -> Tuple[bool, str]:
    """Execute a real connectivity diagnostic test against the database.
    
    Returns:
        Tuple[bool, str]: (is_healthy, message)
    """
    if engine is None:
        return False, "Database engine not initialized: DATABASE_URL is missing."

    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            val = result.scalar()
            if val == 1:
                return True, "Database connection verified successfully (SELECT 1)."
            return False, f"Unexpected query result: {val}"
    except Exception as exc:
        logger.error(f"Database connectivity check failed: {str(exc)}")
        return False, f"Database connectivity error: {str(exc)}"
