import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
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
