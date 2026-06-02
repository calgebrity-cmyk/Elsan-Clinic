from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from dependencies.auth import get_current_user, oauth2_scheme
from models.domain import User
from schemas.auth import LoginRequest, Token, UserResponse, ChangePasswordRequest
from repositories.auth import AuthRepository
from services.auth import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(AuthRepository(db))

@router.post("/login", response_model=Token)
async def login(data: LoginRequest, service: AuthService = Depends(get_auth_service)):
    return await service.authenticate_user(data)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str = Header(..., alias="x-refresh-token"),
    service: AuthService = Depends(get_auth_service)
):
    return await service.refresh_access_token(refresh_token)

@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service)
):
    await service.logout(token)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    # Convert Enum to string for response
    return UserResponse(
        id=str(current_user.id),
        full_name=current_user.full_name,
        email=current_user.email,
        phone=current_user.phone,
        role=current_user.role.value,
        is_active=current_user.is_active
    )

@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service)
):
    await service.change_password(current_user, data)
    return {"message": "Password updated successfully"}
