import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.prescription import PrescriptionRepository
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate
from services.qr_service import QRService
from services.cloudinary_service import upload_bytes
from pdf.prescription_generator import PrescriptionPDFGenerator

class PrescriptionService:
    def __init__(self, db: AsyncSession):
        self.repo = PrescriptionRepository(db)

    async def create_prescription(self, data: PrescriptionCreate, clinic_data: dict, doctor_data: dict, patient_data: dict, notes: str, next_visit: str):
        # 1. Save to database
        prescription = await self.repo.create(data)

        # 2. Generate QR Code
        qr_bytes = QRService.generate_verification_qr(str(prescription.id))
        qr_filename = f"qr_{prescription.id}"
        
        # We can upload the QR code if needed, but for now we embed it directly into the PDF.
        # Alternatively, upload the QR: qr_res = await upload_bytes(qr_bytes, "elsan-clinic/qr-codes", qr_filename)

        # 3. Generate PDF
        # Convert DB models to dictionaries for the PDF generator
        medicines_list = [
            {
                "medicine_name": m.medicine_name,
                "dosage": m.dosage,
                "morning": m.morning,
                "afternoon": m.afternoon,
                "night": m.night,
                "duration_days": m.duration_days,
                "instructions": m.instructions
            }
            for m in prescription.medicines
        ]
        
        pdf_gen = PrescriptionPDFGenerator(
            clinic_data=clinic_data,
            doctor_data=doctor_data,
            patient_data=patient_data,
            medicines=medicines_list,
            notes=notes,
            next_visit=next_visit,
            qr_code_bytes=qr_bytes
        )
        pdf_bytes = pdf_gen.generate()

        # 4. Upload PDF to Cloudinary
        pdf_filename = f"prescription_{prescription.id}"
        upload_result = await upload_bytes(pdf_bytes, "elsan-clinic/prescriptions", pdf_filename, resource_type="raw")

        # 5. Update Database with URLs
        await self.repo.update_pdf_urls(prescription.id, upload_result["url"], upload_result["public_id"])
        
        # 6. Refresh model
        return await self.repo.get_by_id(prescription.id)

    async def get_prescription(self, presc_id: uuid.UUID):
        return await self.repo.get_by_id(presc_id)

    async def get_patient_prescriptions(self, patient_id: uuid.UUID):
        return await self.repo.get_by_patient(patient_id)

    async def get_prescription_history(self, patient_id: uuid.UUID = None, doctor_id: uuid.UUID = None, visit_id: uuid.UUID = None, start_date=None, end_date=None, skip: int = 0, limit: int = 100):
        return await self.repo.get_history(patient_id, doctor_id, visit_id, start_date, end_date, skip, limit)

    async def update_prescription(self, presc_id: uuid.UUID, data: PrescriptionUpdate):
        prescription = await self.repo.get_by_id(presc_id)
        if not prescription:
            return None
        return await self.repo.update(prescription, data)

    async def regenerate_prescription_pdf(self, presc_id: uuid.UUID, clinic_data: dict, doctor_data: dict, patient_data: dict, notes: str, next_visit: str):
        prescription = await self.repo.get_by_id(presc_id)
        if not prescription:
            return None
            
        # Re-generate QR Code
        qr_bytes = QRService.generate_verification_qr(str(prescription.id))
        qr_filename = f"qr_{prescription.id}"
        
        medicines_list = [
            {
                "medicine_name": m.medicine_name,
                "dosage": m.dosage,
                "morning": m.morning,
                "afternoon": m.afternoon,
                "night": m.night,
                "duration_days": m.duration_days,
                "instructions": m.instructions
            }
            for m in prescription.medicines
        ]
        
        pdf_gen = PrescriptionPDFGenerator(
            clinic_data=clinic_data,
            doctor_data=doctor_data,
            patient_data=patient_data,
            medicines=medicines_list,
            notes=notes,
            next_visit=next_visit,
            qr_code_bytes=qr_bytes
        )
        pdf_bytes = pdf_gen.generate()

        # Overwrite PDF in Cloudinary using the existing ID
        pdf_filename = prescription.cloudinary_public_id or f"prescription_{prescription.id}"
        upload_result = await upload_bytes(pdf_bytes, "elsan-clinic/prescriptions", pdf_filename, resource_type="raw")

        # Update Database with URLs (in case they changed)
        await self.repo.update_pdf_urls(prescription.id, upload_result["url"], upload_result["public_id"])
        
        return await self.repo.get_by_id(prescription.id)
