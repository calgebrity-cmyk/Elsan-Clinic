# Project Handover Document

**Client:** Elsan Clinic  
**Project:** Elsan Clinic Management System  
**Version:** 1.0.0 (Phase 6 Complete)  

---

## 1. System Overview

The Elsan Clinic Management System is now fully operational. It is a cloud-based software that allows your staff to manage patients, schedule appointments, conduct visits, and generate highly professional, digitally-verified PDF prescriptions. 

The system operates securely on the cloud, meaning your staff can access it from any computer or tablet inside the clinic.

## 2. Admin Credentials Setup

When the system goes live on your production database, an initial Super Admin account must be created.
1. Access the database using your Supabase credentials.
2. The IT team will run a specialized script to generate a bcrypt-hashed password.
3. They will insert the first row into the `users` table with the `role` set to `SUPER_ADMIN`.
4. Using this account, you can log into the Web Dashboard and create additional Doctor and Receptionist accounts manually from the UI.

## 3. Cloud Provider Information

Your application spans across several premium cloud providers:
- **Frontend Hosting**: Vercel (Responsible for serving the website to the browser).
- **Backend Hosting**: Railway / Render (Responsible for processing business logic and generating PDFs).
- **Database**: Supabase PostgreSQL (Responsible for securely storing all patient data).
- **File Storage**: Cloudinary (Responsible for securely hosting clinic logos, doctor signatures, and PDF prescriptions).

## 4. Required Environment Variables

To run the system, the following keys must be securely provided to the IT deployment team:

**Backend:**
- `DATABASE_URL`: Your Supabase connection string.
- `SECRET_KEY`: A long, randomized cryptographic string used for secure logins.
- `CLOUDINARY_CLOUD_NAME`: From your Cloudinary dashboard.
- `CLOUDINARY_API_KEY`: From your Cloudinary dashboard.
- `CLOUDINARY_API_SECRET`: From your Cloudinary dashboard.

**Frontend:**
- `NEXT_PUBLIC_API_URL`: The URL where your backend is hosted (e.g., `https://api.elsanclinic.com/api/v1`).

## 5. Support & Maintenance Instructions

- **Adding a New Doctor**: Log into the Super Admin account, navigate to the Staff/Doctor management page, and create a new profile. The doctor can then log in and upload their digital signature.
- **Updating the Medicine Library**: Doctors and Admins can update the reusable medicine library from the dashboard to speed up prescription writing.
- **Reporting Issues**: If a PDF fails to generate, or a login issue occurs, please instruct the user to refresh the page. If the issue persists, contact your assigned technical support representative with the exact time of the error, as the system securely logs these events in the `audit_logs` database.

**Congratulations on transitioning Elsan Clinic into the digital age!**
