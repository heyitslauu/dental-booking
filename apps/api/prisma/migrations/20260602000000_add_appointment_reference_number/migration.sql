ALTER TABLE "Appointment"
ADD COLUMN "referenceNumber" TEXT NOT NULL DEFAULT upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

CREATE UNIQUE INDEX "Appointment_referenceNumber_key" ON "Appointment"("referenceNumber");

ALTER TABLE "Appointment" ALTER COLUMN "referenceNumber" DROP DEFAULT;
