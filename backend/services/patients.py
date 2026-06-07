import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.patients import PatientRepository
from schemas.patients import PatientCreate, PatientUpdate
from models.domain import Patient, Appointment, AppointmentStatus

class PatientService:
    def __init__(self, repository: PatientRepository, db: AsyncSession):
        self.repository = repository
        self.db = db

    async def get_all_patients(self, skip: int = 0, limit: int = 100):
        return await self.repository.get_all_patients(skip, limit)

    async def get_patient(self, patient_id: str):
        try:
            pid = uuid.UUID(patient_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid patient ID")
            
        patient = await self.repository.get_patient_by_id(pid)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        return patient

    async def search_patients(self, query: str):
        if not query or len(query) < 2:
            return []
        return await self.repository.search_patients(query)

    async def create_patient(self, data: PatientCreate):
        patient_data = data.model_dump(exclude={"doctor_id", "appointment_date", "appointment_time"}, exclude_unset=True)
        # Generate patient code
        patient_data["patient_code"] = f"ELS-{str(uuid.uuid4())[:8].upper()}"
        
        patient = await self.repository.create_patient(patient_data)
        
        # Handle doctor assignment
        doc_id = None
        if data.doctor_id:
            try:
                doc_id = uuid.UUID(data.doctor_id)
                await self.repository.assign_doctor(patient.id, doc_id)
            except ValueError:
                pass
                
        # Handle appointment scheduling
        if data.appointment_date and data.appointment_time:
            new_appt = Appointment(
                patient_id=patient.id,
                doctor_id=doc_id,
                appointment_date=data.appointment_date,
                appointment_time=data.appointment_time,
                status=AppointmentStatus.SCHEDULED
            )
            self.db.add(new_appt)
                
        await self.db.commit()
        await self.db.refresh(patient)
        return patient

    async def update_patient(self, patient_id: str, data: PatientUpdate):
        patient = await self.get_patient(patient_id)
        update_data = data.model_dump(exclude_unset=True)
        
        updated_patient = await self.repository.update_patient(patient, update_data)
        await self.db.commit()
        await self.db.refresh(updated_patient)
        return updated_patient

    async def delete_patient(self, patient_id: str):
        patient = await self.get_patient(patient_id)
        await self.repository.delete_patient(patient)
        await self.db.commit()

    async def get_assigned_doctor(self, patient_id: uuid.UUID):
        return await self.repository.get_assigned_doctor(patient_id)

    async def get_doctor_assigned_patients(self, doctor_id: str):
        try:
            doc_id = uuid.UUID(doctor_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid doctor ID")
        return await self.repository.get_doctor_assigned_patients(doc_id)

    async def get_patient_history(self, patient_id: str):
        # We can aggregate from other repos, or just run a combined query here.
        # For simplicity, let's query Visits, Prescriptions from the DB directly since we have the session.
        try:
            pid = uuid.UUID(patient_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid patient ID")
            
        from sqlalchemy.future import select
        from sqlalchemy.orm import selectinload
        from models.domain import Visit, Prescription, Appointment
        
        visits_res = await self.db.execute(select(Visit).filter(Visit.patient_id == pid).order_by(Visit.created_at.desc()))
        presc_res = await self.db.execute(select(Prescription).filter(Prescription.patient_id == pid).options(selectinload(Prescription.medicines)).order_by(Prescription.created_at.desc()))
        appt_res = await self.db.execute(select(Appointment).filter(Appointment.patient_id == pid).order_by(Appointment.appointment_date.desc()))
        
        return {
            "visits": visits_res.scalars().all(),
            "prescriptions": presc_res.scalars().all(),
            "appointments": appt_res.scalars().all()
        }
