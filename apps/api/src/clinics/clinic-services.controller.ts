import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { ClinicsService } from "./clinics.service";
import { CreateClinicServiceDto } from "./dto/create-clinic-service.dto";
import { UpdateClinicServiceDto } from "./dto/update-clinic-service.dto";

@Controller("clinic-services")
@UseGuards(AdminJwtGuard)
export class ClinicServicesController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findAssignments(
    @CurrentUser() currentUser: CurrentUserType,
    @Query("clinicId") clinicId?: string
  ) {
    return this.clinicsService.findClinicServiceAssignments(clinicId, currentUser);
  }

  @Post()
  createAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() dto: CreateClinicServiceDto
  ) {
    return this.clinicsService.createClinicServiceAssignment(dto, currentUser);
  }

  @Patch(":id")
  updateAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateClinicServiceDto
  ) {
    return this.clinicsService.updateClinicServiceAssignment(id, dto, currentUser);
  }

  @Delete(":id")
  deleteAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string
  ) {
    return this.clinicsService.deleteClinicServiceAssignment(id, currentUser);
  }
}
