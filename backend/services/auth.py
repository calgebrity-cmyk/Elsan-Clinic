from fastapi import HTTPException, status
from core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from repositories.auth import AuthRepository
from schemas.auth import LoginRequest, ChangePasswordRequest, Token
from models.domain import User

class AuthService:
    def __init__(self, repo: AuthRepository):
        self.repo = repo

    async def authenticate_user(self, data: LoginRequest) -> Token:
        user = await self.repo.get_user_by_email(data.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        if not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
            
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account")
            
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        return Token(access_token=access_token, refresh_token=refresh_token)

    async def refresh_access_token(self, refresh_token: str) -> Token:
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
            
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
                
            user = await self.repo.get_user_by_id(user_id)
            if not user or not user.is_active:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
                
            access_token = create_access_token(subject=user.id)
            new_refresh_token = create_refresh_token(subject=user.id)
            
            # Optionally blacklist the old refresh token here
            await self.repo.blacklist_token(refresh_token)
            
            return Token(access_token=access_token, refresh_token=new_refresh_token)
            
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    async def change_password(self, user: User, data: ChangePasswordRequest) -> None:
        if not verify_password(data.old_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
            
        user.password_hash = get_password_hash(data.new_password)
        await self.repo.update_user(user)

    async def logout(self, access_token: str) -> None:
        await self.repo.blacklist_token(access_token)
