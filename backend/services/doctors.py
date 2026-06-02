from fastapi import HTTPException, status
from core.security import get_password_hash
from repositories.doctors import DoctorRepository
from schemas.doctors import DoctorCreate, DoctorUpdate
from models.domain import User, Doctor, RoleEnum

class DoctorService:
    def __init__(self, repo: DoctorRepository):
        self.repo = repo

    async def create_doctor(self, data: DoctorCreate) -> Doctor:
        if await self.repo.get_by_email(data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        if await self.repo.get_by_phone(data.phone):
            raise HTTPException(status_code=400, detail="Phone already registered")

        user = User(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            password_hash=get_password_hash(data.password),
            role=RoleEnum.DOCTOR,
            is_active=True
        )

        doctor = Doctor(
            specialization=data.specialization,
            qualification=data.qualification,
            experience_years=data.experience_years,
            consultation_fee=data.consultation_fee,
            consultation_timings=data.consultation_timings,
            signature_url=data.signature_url,
            status=True
        )

        return await self.repo.create(user, doctor)

    async def get_all_doctors(self) -> list[Doctor]:
        return await self.repo.get_all_doctors()

    async def get_doctor(self, doctor_id: str) -> Doctor:
        doctor = await self.repo.get_doctor_by_id(doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        return doctor

    async def update_doctor(self, doctor_id: str, data: DoctorUpdate) -> Doctor:
        doctor = await self.get_doctor(doctor_id)
        user = doctor.user
        
        # User fields update
        if data.email and data.email != user.email:
            if await self.repo.get_by_email(data.email):
                raise HTTPException(status_code=400, detail="Email already taken")
            user.email = data.email
            
        if data.phone and data.phone != user.phone:
            if await self.repo.get_by_phone(data.phone):
                raise HTTPException(status_code=400, detail="Phone already taken")
            user.phone = data.phone
            
        if data.full_name is not None:
            user.full_name = data.full_name

        # Doctor fields update
        if data.specialization is not None:
            doctor.specialization = data.specialization
        if data.qualification is not None:
            doctor.qualification = data.qualification
        if data.experience_years is not None:
            doctor.experience_years = data.experience_years
        if data.consultation_fee is not None:
            doctor.consultation_fee = data.consultation_fee
        if data.consultation_timings is not None:
            doctor.consultation_timings = data.consultation_timings
        if data.signature_url is not None:
            doctor.signature_url = data.signature_url
            
        return await self.repo.update(user, doctor)

    async def set_active_status(self, doctor_id: str, is_active: bool) -> Doctor:
        doctor = await self.get_doctor(doctor_id)
        # We can deactivate both the doctor status and the user login access
        doctor.status = is_active
        doctor.user.is_active = is_active
        return await self.repo.update(doctor.user, doctor)

    async def delete_doctor(self, doctor_id: str) -> None:
        doctor = await self.get_doctor(doctor_id)
        await self.repo.delete(doctor.user, doctor)
