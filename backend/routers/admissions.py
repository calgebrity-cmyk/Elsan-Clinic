from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from typing import List
from pydantic import UUID4
from datetime import datetime, timezone

from database.database import get_db
from models.domain import Admission, AdmissionDailyVisit, AdmissionStatus, Patient, Doctor
from schemas.admissions import AdmissionCreate, AdmissionResponse, AdmissionDailyVisitCreate, AdmissionDailyVisitResponse

router = APIRouter(prefix="/api/v1/admissions", tags=["Admissions"])

def get_utc_now():
    return datetime.now(timezone.utc)

@router.get("", response_model=List[AdmissionResponse])
async def get_admissions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Admission)
        .options(
            selectinload(Admission.patient),
            selectinload(Admission.admitting_doctor).selectinload(Doctor.user),
            selectinload(Admission.daily_visits).selectinload(AdmissionDailyVisit.doctor).selectinload(Doctor.user)
        )
        .order_by(Admission.admission_date.desc())
    )
    admissions = result.scalars().all()
    
    response_list = []
    for adm in admissions:
        resp = AdmissionResponse.from_orm(adm)
        resp.patient_name = adm.patient.full_name if adm.patient else None
        resp.patient_phone = adm.patient.phone if adm.patient else None
        resp.admitting_doctor_name = adm.admitting_doctor.user.full_name if (adm.admitting_doctor and adm.admitting_doctor.user) else None
        
        visits_resp = []
        for v in adm.daily_visits:
            vr = AdmissionDailyVisitResponse.from_orm(v)
            vr.doctor_name = v.doctor.user.full_name if (v.doctor and v.doctor.user) else None
            visits_resp.append(vr)
        resp.daily_visits = visits_resp
        
        response_list.append(resp)
        
    return response_list

@router.post("", response_model=AdmissionResponse)
async def create_admission(admission_in: AdmissionCreate, db: AsyncSession = Depends(get_db)):
    # Generate Admission Number
    count_result = await db.execute(select(func.count(Admission.id)))
    total_admissions = count_result.scalar() or 0
    admission_number = f"ADM-{(total_admissions + 1):04d}"

    new_adm = Admission(
        **admission_in.dict(),
        admission_number=admission_number
    )
    db.add(new_adm)
    await db.commit()
    await db.refresh(new_adm)
    
    # Fetch with relations to return proper response
    result = await db.execute(
        select(Admission)
        .options(
            selectinload(Admission.patient),
            selectinload(Admission.admitting_doctor).selectinload(Doctor.user),
            selectinload(Admission.daily_visits)
        )
        .filter(Admission.id == new_adm.id)
    )
    adm = result.scalar_one()
    
    resp = AdmissionResponse.from_orm(adm)
    resp.patient_name = adm.patient.full_name if adm.patient else None
    resp.patient_phone = adm.patient.phone if adm.patient else None
    resp.admitting_doctor_name = adm.admitting_doctor.user.full_name if (adm.admitting_doctor and adm.admitting_doctor.user) else None
    resp.daily_visits = []
    return resp

@router.put("/{admission_id}/discharge", response_model=AdmissionResponse)
async def discharge_admission(admission_id: UUID4, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Admission)
        .options(
            selectinload(Admission.patient),
            selectinload(Admission.admitting_doctor).selectinload(Doctor.user),
            selectinload(Admission.daily_visits).selectinload(AdmissionDailyVisit.doctor).selectinload(Doctor.user)
        )
        .filter(Admission.id == admission_id)
    )
    adm = result.scalar_one_or_none()
    
    if not adm:
        raise HTTPException(status_code=404, detail="Admission not found")
        
    if adm.status == AdmissionStatus.DISCHARGED.value:
        raise HTTPException(status_code=400, detail="Patient already discharged")
        
    adm.status = AdmissionStatus.DISCHARGED.value
    adm.discharge_date = get_utc_now()
    await db.commit()
    
    resp = AdmissionResponse.from_orm(adm)
    resp.patient_name = adm.patient.full_name if adm.patient else None
    resp.patient_phone = adm.patient.phone if adm.patient else None
    resp.admitting_doctor_name = adm.admitting_doctor.user.full_name if (adm.admitting_doctor and adm.admitting_doctor.user) else None
    return resp

@router.post("/{admission_id}/daily-visits", response_model=AdmissionDailyVisitResponse)
async def add_daily_visit(admission_id: UUID4, visit_in: AdmissionDailyVisitCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admission).filter(Admission.id == admission_id))
    adm = result.scalar_one_or_none()
    if not adm:
        raise HTTPException(status_code=404, detail="Admission not found")
        
    if adm.status == AdmissionStatus.DISCHARGED.value:
        raise HTTPException(status_code=400, detail="Cannot add daily visit to discharged patient")

    new_visit = AdmissionDailyVisit(**visit_in.dict(), admission_id=admission_id)
    db.add(new_visit)
    await db.commit()
    await db.refresh(new_visit)
    
    # Load doctor relation
    v_res = await db.execute(
        select(AdmissionDailyVisit)
        .options(selectinload(AdmissionDailyVisit.doctor).selectinload(Doctor.user))
        .filter(AdmissionDailyVisit.id == new_visit.id)
    )
    v = v_res.scalar_one()
    
    resp = AdmissionDailyVisitResponse.from_orm(v)
    resp.doctor_name = v.doctor.user.full_name if (v.doctor and v.doctor.user) else None
    return resp
