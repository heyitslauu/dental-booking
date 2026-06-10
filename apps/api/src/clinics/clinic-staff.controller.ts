import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { ClinicsService } from "./clinics.service";
import { CreateClinicStaffDto } from "./dto/create-clinic-staff.dto";
import { UpdateClinicStaffDto } from "./dto/update-clinic-staff.dto";

@Controller("clinic-staff")
@UseGuards(AdminJwtGuard)
export class ClinicStaffController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findAssignments(
    @CurrentUser() currentUser: CurrentUserType,
    @Query("clinicId") clinicId?: string
  ) {
    return this.clinicsService.findClinicStaffAssignments(clinicId, currentUser);
  }

  @Post()
  createAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() dto: CreateClinicStaffDto
  ) {
    return this.clinicsService.createClinicStaffAssignment(dto, currentUser);
  }

  @Patch(":id")
  updateAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateClinicStaffDto
  ) {
    return this.clinicsService.updateClinicStaffAssignment(id, dto, currentUser);
  }

  @Delete(":id")
  deleteAssignment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string
  ) {
    return this.clinicsService.deleteClinicStaffAssignment(id, currentUser);
  }
}
