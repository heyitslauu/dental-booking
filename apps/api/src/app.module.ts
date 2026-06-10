import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccessControlModule } from "./access-control/access-control.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { AuthModule } from "./auth/auth.module";
import { ClinicsModule } from "./clinics/clinics.module";
import { PatientsModule } from "./patients/patients.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ServicesModule } from "./services/services.module";
import { StaffModule } from "./staff/staff.module";

@Module({
  imports: [
    PrismaModule,
    AccessControlModule,
    AuthModule,
    ClinicsModule,
    PatientsModule,
    AppointmentsModule,
    ServicesModule,
    StaffModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
