import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
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
  findAll(@CurrentUser() currentUser: CurrentUserType) {
    return this.clinicsService.findAllClinics(currentUser);
  }

  @Post("admin")
  @UseGuards(AdminJwtGuard)
  create(@CurrentUser() currentUser: CurrentUserType, @Body() dto: CreateClinicDto) {
    return this.clinicsService.createClinic(dto, currentUser);
  }

  @Patch("admin/:clinicId")
  @UseGuards(AdminJwtGuard)
  update(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("clinicId") clinicId: string,
    @Body() dto: UpdateClinicDto
  ) {
    return this.clinicsService.updateClinic(clinicId, dto, currentUser);
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
