import uuid
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.domain import Doctor
from services.cloudinary_service import upload_file, delete_file
from services.audit_service import AuditService

class SignatureService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit = AuditService(db)

    async def upload_signature(self, doctor_id: uuid.UUID, file: UploadFile, user_id: uuid.UUID) -> Doctor:
        # Validate doctor exists
        result = await self.db.execute(select(Doctor).where(Doctor.id == doctor_id))
        doctor = result.scalar_one_or_none()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        # Delete existing signature if it exists
        if doctor.signature_public_id:
            delete_file(doctor.signature_public_id)

        # Upload new signature
        upload_result = await upload_file(file, folder="elsan-clinic/doctor-signatures")
        
        # Update doctor record
        doctor.signature_url = upload_result["url"]
        doctor.signature_public_id = upload_result["public_id"]
        
        await self.db.commit()
        await self.db.refresh(doctor)
        
        # Log event
        await self.audit.log_event(
            user_id=user_id,
            action="UPLOAD_SIGNATURE",
            entity_type="DOCTOR",
            entity_id=doctor.id,
            details=f"Uploaded signature {upload_result['public_id']}"
        )
        
        return doctor

    async def delete_signature(self, doctor_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        result = await self.db.execute(select(Doctor).where(Doctor.id == doctor_id))
        doctor = result.scalar_one_or_none()
        if not doctor or not doctor.signature_public_id:
            return False

        delete_file(doctor.signature_public_id)
        doctor.signature_url = None
        doctor.signature_public_id = None
        
        await self.db.commit()
        
        await self.audit.log_event(
            user_id=user_id,
            action="DELETE_SIGNATURE",
            entity_type="DOCTOR",
            entity_id=doctor_id
        )
        
        return True
