from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.security import decode_token
from database.database import get_db
from models.domain import User, TokenBlacklist
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def is_token_blacklisted(token: str, db: AsyncSession) -> bool:
    result = await db.execute(select(TokenBlacklist).where(TokenBlacklist.token == token))
    if result.scalars().first():
        return True
    return False

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if await is_token_blacklisted(token, db):
        raise HTTPException(status_code=401, detail="Token has been revoked")
        
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user
