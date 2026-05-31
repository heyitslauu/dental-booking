import { Module } from "@nestjs/common";
import { ClinicsController } from "./clinics.controller";
import { ClinicServicesController } from "./clinic-services.controller";
import { ClinicStaffController } from "./clinic-staff.controller";
import { ClinicsService } from "./clinics.service";

@Module({
  controllers: [ClinicsController, ClinicServicesController, ClinicStaffController],
  providers: [ClinicsService],
  exports: [ClinicsService]
})
export class ClinicsModule {}
