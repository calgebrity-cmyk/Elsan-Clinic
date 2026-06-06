from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date, time
import uuid

class PatientBase(BaseModel):
    full_name: str = Field(..., max_length=150)
    age: int
    gender: str = Field(..., max_length=20)
    blood_group: Optional[str] = Field(None, max_length=10)
    phone: str = Field(..., max_length=20)
    address: Optional[str] = None
    medical_history: Optional[str] = None
    email: Optional[EmailStr] = None
    emergency_contact: Optional[str] = Field(None, max_length=100)
    allergies: Optional[str] = None
    current_symptoms: Optional[str] = None
    notes: Optional[str] = None

class PatientCreate(PatientBase):
    doctor_id: Optional[str] = None  # To assign a doctor upon registration
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    registered_by_id: Optional[str] = None
    registered_by_name: Optional[str] = None

class PatientUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=150)
    age: Optional[int] = None
    gender: Optional[str] = Field(None, max_length=20)
    blood_group: Optional[str] = Field(None, max_length=10)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    medical_history: Optional[str] = None
    email: Optional[EmailStr] = None
    emergency_contact: Optional[str] = Field(None, max_length=100)
    allergies: Optional[str] = None
    current_symptoms: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None

class PatientResponse(PatientBase):
    id: uuid.UUID
    patient_code: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    assigned_doctor_id: Optional[uuid.UUID] = None
    assigned_doctor_name: Optional[str] = None
    registered_by_id: Optional[uuid.UUID] = None
    registered_by_name: Optional[str] = None

    class Config:
        from_attributes = True
