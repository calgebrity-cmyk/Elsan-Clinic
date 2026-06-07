from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from models.domain import User, Prescription, Patient
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from services.whatsapp_service import whatsapp_service
from services.prescription_service import PrescriptionService

router = APIRouter(prefix="/api/v1/whatsapp", tags=["WhatsApp Delivery"])

class SendPrescriptionRequest(BaseModel):
    prescription_id: str

@router.post("/send-prescription", status_code=status.HTTP_200_OK)
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def send_prescription(
    data: SendPrescriptionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        presc_id = uuid.UUID(data.prescription_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid prescription ID format")

    service = PrescriptionService(db)
    prescription = await service.get_prescription(presc_id)
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
        
    if not prescription.pdf_url:
        raise HTTPException(status_code=400, detail="PDF has not been generated for this prescription yet")
        
    if not prescription.patient or not prescription.patient.phone:
        raise HTTPException(status_code=400, detail="Patient does not have a phone number registered")

    log_entry = await whatsapp_service.send_prescription_pdf(
        db=db,
        prescription_id=str(prescription.id),
        patient_phone=prescription.patient.phone,
        pdf_url=prescription.pdf_url,
        patient_id=str(prescription.patient_id)
    )
    
    return {
        "status": "success", 
        "message": "Prescription sent successfully via WhatsApp",
        "whatsapp_log_id": str(log_entry.id) if log_entry else None
    }
