from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
import uuid
import csv
import io
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from database.database import get_db
from models.domain import User, ClinicMedicine
from dependencies.auth import get_current_user
from middleware.rbac import require_roles
from schemas.medicine import ClinicMedicineCreate, ClinicMedicineUpdate, ClinicMedicineResponse
from services.medicine_service import MedicineService
from sqlalchemy.future import select

router = APIRouter(prefix="/api/v1/medicines", tags=["Medicines Library"])

def get_medicine_service(db: AsyncSession = Depends(get_db)) -> MedicineService:
    return MedicineService(db)

@router.post("", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def create_medicine(
    data: ClinicMedicineCreate,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    return await service.create_medicine(data)

@router.get("", response_model=List[ClinicMedicineResponse])
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def list_medicines(
    search: str = None,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    return await service.list_medicines(search)

@router.get("/search", response_model=List[ClinicMedicineResponse])
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def search_medicines(
    q: str = Query(..., min_length=2),
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    return await service.list_medicines(q)

@router.post("/upload-csv")
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def upload_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")
    
    content = await file.read()
    try:
        decoded_content = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded_content = content.decode("latin-1")
        
    reader = csv.DictReader(io.StringIO(decoded_content))
    added_count = 0
    
    standard_keys = {
        "name": ["name", "medicine_name", "medicine name", "drug_name", "drug"],
        "generic_name": ["generic_name", "generic name", "composition"],
        "default_dosage": ["dosage", "strength", "default_dosage"],
        "default_frequency": ["frequency", "default_frequency"],
        "default_instructions": ["instructions", "notes", "directions"]
    }
    
    # Helper to map row headers to standard fields
    for row in reader:
        medicine_data = {}
        dynamic_fields = {}
        
        for key, value in row.items():
            if not key or not value:
                continue
            
            key_clean = key.strip().lower()
            val_clean = value.strip()
            
            mapped = False
            for std_key, aliases in standard_keys.items():
                if key_clean in aliases:
                    medicine_data[std_key] = val_clean
                    mapped = True
                    break
            
            if not mapped:
                dynamic_fields[key.strip()] = val_clean
                
        if "name" not in medicine_data or not medicine_data["name"]:
            continue # Skip invalid rows without a name
            
        medicine_data["dynamic_fields"] = dynamic_fields
        
        # Check if medicine already exists to avoid unique constraint error
        stmt = select(ClinicMedicine).where(ClinicMedicine.name == medicine_data["name"])
        existing = await db.execute(stmt)
        if not existing.scalar_one_or_none():
            med = ClinicMedicine(**medicine_data)
            db.add(med)
            added_count += 1
            
    await db.commit()
    return {"status": "success", "medicines_added": added_count}

@router.get("/{id}", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"])
async def get_medicine(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    med = await service.get_medicine(id)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med

@router.put("/{id}", response_model=ClinicMedicineResponse)
@require_roles(["SUPER_ADMIN", "DOCTOR"])
async def update_medicine(
    id: uuid.UUID,
    data: ClinicMedicineUpdate,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    med = await service.update_medicine(id, data)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med

@router.delete("/{id}")
@require_roles(["SUPER_ADMIN"])
async def delete_medicine(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: MedicineService = Depends(get_medicine_service)
):
    await service.delete_medicine(id)
    return {"status": "deleted"}
