# Security Documentation

Security is paramount in the Elsan Clinic Management System, as it handles sensitive Personal Health Information (PHI). 

## 1. Authentication (JWT & HTTPOnly Cookies)
We completely avoid storing tokens in `localStorage` to prevent Cross-Site Scripting (XSS) attacks.
- Upon successful login, the FastAPI backend issues an `access_token` and `refresh_token`.
- These tokens are injected into the client's browser as `HTTPOnly`, `Secure`, `SameSite=Lax` cookies.
- JavaScript cannot read these cookies, meaning a malicious script cannot steal the authentication tokens.

## 2. Password Hashing
- User passwords are NEVER stored in plaintext.
- We utilize the `passlib` library implementing the **BCrypt** hashing algorithm with a high work factor to thwart brute-force and rainbow table attacks.

## 3. Role-Based Access Control (RBAC)
- A strict hierarchical permissions system is enforced at the router level via the `@require_roles()` decorator.
- `SUPER_ADMIN`: Omnipotent access. Can delete doctors, assign roles, configure global settings.
- `DOCTOR`: Elevated access. Can create prescriptions, view their own history, regenerate PDFs.
- `RECEPTIONIST`: Operational access. Can schedule appointments, view histories, but cannot write medical diagnoses or generate prescriptions.

## 4. Secure File Access (Cloudinary)
- Prescriptions contain highly sensitive data. The Cloudinary bucket is configured securely.
- While the QR code allows public verification of specific datapoints, the actual raw PDF is not easily guessable.
- For internal sharing, the backend utilizes `cloudinary.utils.cloudinary_url(sign_url=True)` to generate cryptographically signed URLs that automatically expire, preventing permanent unauthorized access if a link is leaked.

## 5. Audit Logging
- An `audit_logs` table persistently tracks high-risk actions.
- Any time a user uploads a signature, downloads a PDF, or forcefully regenerates a prescription, the `AuditService` logs the Exact Timestamp, User ID, Action Type, and Target Entity ID. 
- This provides an immutable paper trail for HIPAA/regulatory compliance auditing.

## 6. Protection Against ID Enumeration
- The PostgreSQL database entirely abandons auto-incrementing integers for primary keys (`id = 1, 2, 3...`).
- Instead, `UUIDv4` is used across all tables (`id = f47ac10b-58cc-4372-a567-0e02b2c3d479`).
- This makes it mathematically impossible for an attacker to sequentially scrape patients or prescriptions.
