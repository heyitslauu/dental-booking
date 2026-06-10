import { Module } from "@nestjs/common";
import { AccessControlModule } from "../access-control/access-control.module";
import { ClinicsController } from "./clinics.controller";
import { ClinicServicesController } from "./clinic-services.controller";
import { ClinicStaffController } from "./clinic-staff.controller";
import { ClinicsService } from "./clinics.service";

@Module({
  imports: [AccessControlModule],
  controllers: [ClinicsController, ClinicServicesController, ClinicStaffController],
  providers: [ClinicsService],
  exports: [ClinicsService]
})
export class ClinicsModule {}
