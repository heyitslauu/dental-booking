import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppointmentsModule } from "./appointments/appointments.module";
import { ClinicsModule } from "./clinics/clinics.module";
import { PatientsModule } from "./patients/patients.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ServicesModule } from "./services/services.module";

@Module({
  imports: [
    PrismaModule,
    ClinicsModule,
    PatientsModule,
    AppointmentsModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
