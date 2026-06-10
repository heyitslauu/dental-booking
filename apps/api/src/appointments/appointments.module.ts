import { Module } from "@nestjs/common";
import { AccessControlModule } from "../access-control/access-control.module";
import { ClinicsModule } from "../clinics/clinics.module";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";

@Module({
  imports: [AccessControlModule, ClinicsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService]
})
export class AppointmentsModule {}
