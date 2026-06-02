from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class DoctorCreate(BaseModel):
    # User fields
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    password: str = Field(..., min_length=8)
    # Doctor fields
    specialization: str
    qualification: str
    experience_years: int = Field(..., ge=0)
    consultation_fee: int = Field(..., ge=0)
    consultation_timings: Optional[str] = None
    signature_url: Optional[str] = None

class DoctorUpdate(BaseModel):
    # User fields
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    # Doctor fields
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    consultation_fee: Optional[int] = None
    consultation_timings: Optional[str] = None
    signature_url: Optional[str] = None

class DoctorResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: EmailStr
    phone: str
    specialization: str
    qualification: str
    experience_years: int
    consultation_fee: int
    consultation_timings: Optional[str]
    signature_url: Optional[str]
    is_active: bool
    status: bool # doctor specific status
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
