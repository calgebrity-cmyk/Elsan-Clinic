import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import UploadFile, HTTPException
from core.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

def validate_file(file: UploadFile):
    """Validates the file type and size."""
    ext = file.filename.split('.')[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension {ext} not allowed.")
    
    # Check size (if possible before upload, otherwise we rely on fastapi limits)
    # Fastapi UploadFile doesn't immediately know size until read, but we can check during upload.
    return True

async def upload_file(file: UploadFile, folder: str) -> dict:
    """
    Uploads a file to a specific folder in Cloudinary.
    Valid folders: elsan-clinic/logos, elsan-clinic/signatures, elsan-clinic/prescriptions
    """
    validate_file(file)
    
    # Read file content
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE_MB}MB limit.")
    
    try:
        # Determine resource type
        resource_type = "image" if not file.filename.endswith(".pdf") else "raw"
        
        response = cloudinary.uploader.upload(
            content,
            folder=folder,
            resource_type=resource_type,
            use_filename=True,
            unique_filename=True
        )
        return {
            "public_id": response.get("public_id"),
            "url": response.get("secure_url"),
            "format": response.get("format"),
            "bytes": response.get("bytes")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

async def upload_bytes(content: bytes, folder: str, filename: str, resource_type: str = "image") -> dict:
    """
    Uploads raw bytes to Cloudinary. Useful for dynamically generated PDFs and QR codes.
    """
    try:
        response = cloudinary.uploader.upload(
            content,
            folder=folder,
            resource_type=resource_type,
            public_id=filename,
            overwrite=True
        )
        return {
            "public_id": response.get("public_id"),
            "url": response.get("secure_url"),
            "format": response.get("format"),
            "bytes": response.get("bytes")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary byte upload failed: {str(e)}")

def delete_file(public_id: str, resource_type: str = "image") -> bool:
    """
    Deletes a file from Cloudinary by its public ID.
    """
    try:
        response = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        if response.get("result") == "ok":
            return True
        return False
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary delete failed: {str(e)}")

def generate_signed_url(public_id: str) -> str:
    """
    Generates a signed url for a private asset.
    """
    return cloudinary.utils.cloudinary_url(
        public_id,
        sign_url=True
    )[0]
