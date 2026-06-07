import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from core.config import settings

async def run_migrations():
    # Use isolation_level="AUTOCOMMIT" to allow ALTER TYPE ... ADD VALUE outside of a transaction block
    connect_args = {"statement_cache_size": 0} if "postgresql" in settings.DATABASE_URL else {}
    engine = create_async_engine(settings.DATABASE_URL, isolation_level="AUTOCOMMIT", connect_args=connect_args)
    async with engine.connect() as conn:
        print("Running schema updates...")
        
        # 1. Update patients table columns
        try:
            await conn.execute(text("ALTER TABLE patients ADD COLUMN email VARCHAR(255);"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN emergency_contact VARCHAR(100);"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN allergies TEXT;"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN current_symptoms TEXT;"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN notes TEXT;"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN registered_by_id UUID REFERENCES users(id) ON DELETE SET NULL;"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN registered_by_name VARCHAR(150);"))
            await conn.execute(text("ALTER TABLE patients ADD COLUMN is_active BOOLEAN DEFAULT TRUE;"))
            print("Successfully updated patients table columns.")
        except Exception as e:
            print(f"Error updating patients columns: {e}")

        # 2. Make diagnosis nullable in visits table
        try:
            await conn.execute(text("ALTER TABLE visits ALTER COLUMN diagnosis DROP NOT NULL;"))
            print("Successfully made visits.diagnosis nullable.")
        except Exception as e:
            print(f"Error altering visits table: {e}")

        # 3. Update appointmentstatus enum
        try:
            await conn.execute(text("ALTER TYPE appointmentstatus ADD VALUE IF NOT EXISTS 'CHECKED_IN';"))
            print("Successfully updated appointmentstatus enum.")
        except Exception as e:
            print(f"Error updating appointmentstatus enum: {e}")

        # 4. Create patient_doctor_mapping table
        try:
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS patient_doctor_mapping (
                    id UUID PRIMARY KEY,
                    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
                    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
                    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                );
            """))
            print("Successfully verified/created patient_doctor_mapping table.")
        except Exception as e:
            print(f"Error creating patient_doctor_mapping table: {e}")

        # 5. Make doctor_id nullable in appointments table
        try:
            await conn.execute(text("ALTER TABLE appointments ALTER COLUMN doctor_id DROP NOT NULL;"))
            print("Successfully made appointments.doctor_id nullable.")
        except Exception as e:
            print(f"Error altering appointments table: {e}")

        # 6. Create admissions and admission_daily_visits tables
        try:
            await conn.execute(text("CREATE TYPE IF NOT EXISTS admissionstatus AS ENUM ('ADMITTED', 'DISCHARGED');"))
        except Exception:
            pass # type might already exist, handle gracefully

        try:
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS admissions (
                    id UUID PRIMARY KEY,
                    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
                    admitting_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
                    admission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    discharge_date TIMESTAMP WITH TIME ZONE,
                    reason_for_admission TEXT NOT NULL,
                    room_bed_number VARCHAR(100),
                    status VARCHAR(50) DEFAULT 'ADMITTED',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))
            await conn.execute(text("ALTER TABLE admissions ADD COLUMN admission_number VARCHAR(50);"))
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_admissions_number ON admissions(admission_number);"))
            await conn.execute(text("ALTER TABLE admissions ADD COLUMN attender_mobile_number VARCHAR(20);"))
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS admission_daily_visits (
                    id UUID PRIMARY KEY,
                    admission_id UUID NOT NULL REFERENCES admissions(id) ON DELETE CASCADE,
                    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
                    visit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    notes TEXT NOT NULL
                );
            """))
            print("Successfully verified/created admissions and admission_daily_visits tables.")
        except Exception as e:
            print(f"Error creating admissions tables: {e}")

        # 7. Add dynamic_fields to clinic_medicines
        try:
            await conn.execute(text("ALTER TABLE clinic_medicines ADD COLUMN dynamic_fields JSONB;"))
            print("Successfully added dynamic_fields to clinic_medicines.")
        except Exception as e:
            print(f"Error adding dynamic_fields: {e}")

    await engine.dispose()
    print("Database migrations completed.")

if __name__ == "__main__":
    asyncio.run(run_migrations())
