import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ClinicsService } from "./clinics.service";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";

@Controller("clinics")
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findActive() {
    return this.clinicsService.findActiveClinics();
  }

  @Get("admin")
  findAll() {
    return this.clinicsService.findAllClinics();
  }

  @Post("admin")
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.createClinic(dto);
  }

  @Patch("admin/:clinicId")
  update(@Param("clinicId") clinicId: string, @Body() dto: UpdateClinicDto) {
    return this.clinicsService.updateClinic(clinicId, dto);
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
