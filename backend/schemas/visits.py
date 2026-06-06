from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import uuid

class VisitBase(BaseModel):
    symptoms: str
    diagnosis: Optional[str] = None
    doctor_notes: Optional[str] = None
    next_visit_date: Optional[date] = None

class VisitCreate(VisitBase):
    patient_id: str
    doctor_id: str
    appointment_id: Optional[str] = None

class VisitUpdate(BaseModel):
    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    doctor_notes: Optional[str] = None
    next_visit_date: Optional[date] = None

class VisitResponse(VisitBase):
    id: uuid.UUID
    patient_id: uuid.UUID
    doctor_id: uuid.UUID
    appointment_id: Optional[uuid.UUID] = None
    created_at: datetime
    
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None

    class Config:
        from_attributes = True
