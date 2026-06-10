-- Update global account roles from ADMIN/STAFF/PATIENT to SUPER_ADMIN/ORG_ADMIN/STAFF/PATIENT.
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'STAFF', 'PATIENT');

ALTER TABLE "User"
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "UserRole"
  USING (
    CASE "role"::text
      WHEN 'ADMIN' THEN 'SUPER_ADMIN'
      ELSE "role"::text
    END
  )::"UserRole",
  ALTER COLUMN "role" SET DEFAULT 'PATIENT';

DROP TYPE "UserRole_old";

CREATE TYPE "ClinicAccessRole" AS ENUM (
  'CLINIC_ADMIN',
  'RECEPTIONIST',
  'DENTIST',
  'ASSISTANT'
);

CREATE TABLE "UserClinicAccess" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "clinicId" TEXT NOT NULL,
  "role" "ClinicAccessRole" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserClinicAccess_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserClinicAccess"
  ADD CONSTRAINT "UserClinicAccess_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserClinicAccess"
  ADD CONSTRAINT "UserClinicAccess_clinicId_fkey"
  FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "UserClinicAccess_userId_clinicId_role_key"
  ON "UserClinicAccess"("userId", "clinicId", "role");
CREATE INDEX "UserClinicAccess_userId_idx" ON "UserClinicAccess"("userId");
CREATE INDEX "UserClinicAccess_clinicId_idx" ON "UserClinicAccess"("clinicId");

ALTER TABLE "Service" ADD COLUMN "organizationId" TEXT;

UPDATE "Service" AS service
SET "organizationId" = COALESCE(
  (
    SELECT clinic."organizationId"
    FROM "ClinicService" AS clinic_service
    INNER JOIN "Clinic" AS clinic ON clinic.id = clinic_service."clinicId"
    WHERE clinic_service."serviceId" = service.id
    ORDER BY clinic_service."createdAt" ASC
    LIMIT 1
  ),
  (
    SELECT organization.id
    FROM "Organization" AS organization
    ORDER BY organization."createdAt" ASC
    LIMIT 1
  )
);

ALTER TABLE "Service" ALTER COLUMN "organizationId" SET NOT NULL;

ALTER TABLE "Service"
  ADD CONSTRAINT "Service_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Service_organizationId_idx" ON "Service"("organizationId");
