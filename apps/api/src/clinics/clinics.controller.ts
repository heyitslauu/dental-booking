import { Controller, Get, Param } from "@nestjs/common";
import { ClinicsService } from "./clinics.service";

@Controller("clinics")
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findActive() {
    return this.clinicsService.findActiveClinics();
  }

  @Get(":clinicId/services")
  findServices(@Param("clinicId") clinicId: string) {
    return this.clinicsService.findServicesByClinic(clinicId);
  }

  @Get(":clinicId/staff")
  findStaff(@Param("clinicId") clinicId: string) {
    return this.clinicsService.findStaffByClinic(clinicId);
  }
}
