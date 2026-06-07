from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
import uuid
from datetime import datetime

class PrescriptionMedicineBase(BaseModel):
    clinic_medicine_id: Optional[uuid.UUID] = None
    medicine_name: str
    dosage: str
    frequency: str
    duration_days: int = Field(gt=0)
    instructions: Optional[str] = None
    morning: bool = False
    afternoon: bool = False
    night: bool = False

class PrescriptionMedicineCreate(PrescriptionMedicineBase):
    pass

class PrescriptionMedicineResponse(PrescriptionMedicineBase):
    id: uuid.UUID
    prescription_id: uuid.UUID
    
    model_config = ConfigDict(from_attributes=True)

class PrescriptionBase(BaseModel):
    visit_id: uuid.UUID
    patient_id: uuid.UUID
    doctor_id: uuid.UUID
    pdf_url: Optional[str] = None
    cloudinary_public_id: Optional[str] = None
    sent_whatsapp: bool = False

class PrescriptionCreate(BaseModel):
    visit_id: Optional[uuid.UUID] = None
    patient_id: uuid.UUID
    doctor_id: uuid.UUID
    symptoms: Optional[str] = None
    next_visit_date: Optional[str] = None
    medicines: List[PrescriptionMedicineCreate]

class PrescriptionUpdate(BaseModel):
    sent_whatsapp: Optional[bool] = None

class PrescriptionResponse(PrescriptionBase):
    id: uuid.UUID
    created_at: datetime
    medicines: List[PrescriptionMedicineResponse]
    
    model_config = ConfigDict(from_attributes=True)
