from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.security import decode_token
from database.database import get_db
from models.domain import User, TokenBlacklist
import jwt

def get_token_from_cookie(request: Request) -> str:
    print("DEBUG [get_token_from_cookie] Request URL:", str(request.url))
    print("DEBUG [get_token_from_cookie] Request Headers:", dict(request.headers))
    print("DEBUG [get_token_from_cookie] Request Cookies:", dict(request.cookies))
    token = request.cookies.get("access_token")
    if not token:
        # Fallback to Authorization header for swagger UI testing
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            return auth_header.split(" ")[1]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return token

async def is_token_blacklisted(token: str, db: AsyncSession) -> bool:
    result = await db.execute(select(TokenBlacklist).where(TokenBlacklist.token == token))
    if result.scalars().first():
        return True
    return False

async def get_current_user(token: str = Depends(get_token_from_cookie), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
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
        
    import uuid
    try:
        uuid_obj = uuid.UUID(user_id)
    except ValueError:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.id == uuid_obj))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user
