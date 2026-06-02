from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class StaffCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    password: str = Field(..., min_length=8)
    role: str = Field(..., pattern="^(SUPER_ADMIN|RECEPTIONIST)$")

class StaffUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=20)

class StaffResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
