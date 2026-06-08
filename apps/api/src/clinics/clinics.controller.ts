import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
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
  @UseGuards(AdminJwtGuard)
  findAll() {
    return this.clinicsService.findAllClinics();
  }

  @Post("admin")
  @UseGuards(AdminJwtGuard)
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.createClinic(dto);
  }

  @Patch("admin/:clinicId")
  @UseGuards(AdminJwtGuard)
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
