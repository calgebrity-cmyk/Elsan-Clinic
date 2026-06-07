from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

class ClinicMedicineBase(BaseModel):
    name: str
    generic_name: Optional[str] = None
    default_dosage: Optional[str] = None
    default_frequency: Optional[str] = None
    default_instructions: Optional[str] = None
    dynamic_fields: Optional[Dict[str, Any]] = None
    is_active: bool = True

class ClinicMedicineCreate(ClinicMedicineBase):
    pass

class ClinicMedicineUpdate(BaseModel):
    name: Optional[str] = None
    generic_name: Optional[str] = None
    default_dosage: Optional[str] = None
    default_frequency: Optional[str] = None
    default_instructions: Optional[str] = None
    dynamic_fields: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class ClinicMedicineResponse(ClinicMedicineBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
