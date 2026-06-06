from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional, List
from models.domain import AdmissionStatus

class AdmissionDailyVisitBase(BaseModel):
    doctor_id: Optional[UUID4] = None
    notes: str

class AdmissionDailyVisitCreate(AdmissionDailyVisitBase):
    pass

class AdmissionDailyVisitResponse(AdmissionDailyVisitBase):
    id: UUID4
    admission_id: UUID4
    visit_date: datetime
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True

class AdmissionBase(BaseModel):
    patient_id: UUID4
    admitting_doctor_id: Optional[UUID4] = None
    reason_for_admission: str
    room_bed_number: Optional[str] = None
    attender_mobile_number: Optional[str] = Field(None, max_length=20)

class AdmissionCreate(AdmissionBase):
    pass

class AdmissionResponse(AdmissionBase):
    id: UUID4
    admission_number: Optional[str] = None
    admission_date: datetime
    discharge_date: Optional[datetime] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    admitting_doctor_name: Optional[str] = None
    daily_visits: List[AdmissionDailyVisitResponse] = []

    class Config:
        from_attributes = True

class AdmissionDischarge(BaseModel):
    pass # No specific fields needed to discharge, just calling the endpoint will set the status and date
