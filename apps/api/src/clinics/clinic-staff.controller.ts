import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { ClinicsService } from "./clinics.service";
import { CreateClinicStaffDto } from "./dto/create-clinic-staff.dto";
import { UpdateClinicStaffDto } from "./dto/update-clinic-staff.dto";

@Controller("clinic-staff")
@UseGuards(AdminJwtGuard)
export class ClinicStaffController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findAssignments(@Query("clinicId") clinicId?: string) {
    return this.clinicsService.findClinicStaffAssignments(clinicId);
  }

  @Post()
  createAssignment(@Body() dto: CreateClinicStaffDto) {
    return this.clinicsService.createClinicStaffAssignment(dto);
  }

  @Patch(":id")
  updateAssignment(@Param("id") id: string, @Body() dto: UpdateClinicStaffDto) {
    return this.clinicsService.updateClinicStaffAssignment(id, dto);
  }

  @Delete(":id")
  deleteAssignment(@Param("id") id: string) {
    return this.clinicsService.deleteClinicStaffAssignment(id);
  }
}
