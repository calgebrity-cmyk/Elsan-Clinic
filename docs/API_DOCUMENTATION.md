# API Documentation

The Elsan Clinic REST API is built on FastAPI and follows `/api/v1/` routing. 

**Authentication**: All protected routes require a JWT token passed via `HTTPOnly` cookies (`access_token`).

---

## Authentication (`/api/v1/auth`)

### `POST /login`
- **Description**: Authenticate user and set HTTPOnly cookies.
- **Request Body**: `OAuth2PasswordRequestForm` (username, password).
- **Response Body**: `{ "access_token": string, "token_type": "bearer", "role": string }`
- **Roles**: Public

### `POST /refresh`
- **Description**: Issue a new access token using a valid refresh token cookie.
- **Roles**: Authenticated Users

---

## Doctors (`/api/v1/doctors`)

### `POST /{id}/signature`
- **Description**: Upload or replace a doctor's signature.
- **Request**: `multipart/form-data` (file: UploadFile)
- **Response**: `DoctorResponse`
- **Roles**: `SUPER_ADMIN`, `DOCTOR`

### `DELETE /{id}/signature`
- **Description**: Remove a signature from Cloudinary and DB.
- **Roles**: `SUPER_ADMIN`, `DOCTOR`

---

## Medicines Library (`/api/v1/medicines`)

### `GET /`
- **Description**: List all reusable clinic medicines. Supports `?search=` query parameter.
- **Response**: `List[ClinicMedicineResponse]`
- **Roles**: `SUPER_ADMIN`, `DOCTOR`, `RECEPTIONIST`

### `POST /`
- **Description**: Add a new generic medicine to the library.
- **Request Body**: `ClinicMedicineCreate` (name, generic_name, default_dosage).
- **Roles**: `SUPER_ADMIN`, `DOCTOR`

---

## Prescriptions (`/api/v1/prescriptions`)

### `POST /`
- **Description**: Generate a new PDF prescription from a Visit.
- **Request Body**: `PrescriptionCreate` (visit_id, patient_id, doctor_id, List of medicines).
- **Behavior**: Saves to DB, generates QR, compiles PDF via ReportLab, uploads to Cloudinary.
- **Roles**: `SUPER_ADMIN`, `DOCTOR`

### `GET /history`
- **Description**: Searchable, filterable history.
- **Query Params**: `patient_id`, `doctor_id`, `start_date`, `end_date`, `skip`, `limit`.
- **Response**: `List[PrescriptionResponse]`
- **Roles**: `SUPER_ADMIN`, `DOCTOR` (can only view own), `RECEPTIONIST`

### `GET /verify/{id}`
- **Description**: Public endpoint used by Pharmacists scanning the QR code on the physical PDF.
- **Response**: `{ "status": "VALID", "patient_name": "...", "pdf_url": "..." }`
- **Roles**: Public (No Auth Required)

### `GET /{id}/download`
- **Description**: Returns the direct PDF URL while incrementing the download count and logging the `DOWNLOAD_PDF` event in `audit_logs`.
- **Response**: `{ "download_url": string }`
- **Roles**: `SUPER_ADMIN`, `DOCTOR`, `RECEPTIONIST`

### `GET /{id}/signed-url`
- **Description**: Generates an expiring secure Cloudinary URL.
- **Response**: `{ "signed_url": string }`
- **Roles**: `SUPER_ADMIN`, `DOCTOR`, `RECEPTIONIST`

### `POST /{id}/regenerate-pdf`
- **Description**: Re-runs the ReportLab PDF generation logic and cleanly overwrites the existing Cloudinary asset to preserve storage. Logs `REGENERATE_PDF`.
- **Roles**: `SUPER_ADMIN`, `DOCTOR`
