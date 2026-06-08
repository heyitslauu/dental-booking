import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { ClinicsService } from "./clinics.service";
import { CreateClinicServiceDto } from "./dto/create-clinic-service.dto";
import { UpdateClinicServiceDto } from "./dto/update-clinic-service.dto";

@Controller("clinic-services")
@UseGuards(AdminJwtGuard)
export class ClinicServicesController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findAssignments(@Query("clinicId") clinicId?: string) {
    return this.clinicsService.findClinicServiceAssignments(clinicId);
  }

  @Post()
  createAssignment(@Body() dto: CreateClinicServiceDto) {
    return this.clinicsService.createClinicServiceAssignment(dto);
  }

  @Patch(":id")
  updateAssignment(@Param("id") id: string, @Body() dto: UpdateClinicServiceDto) {
    return this.clinicsService.updateClinicServiceAssignment(id, dto);
  }

  @Delete(":id")
  deleteAssignment(@Param("id") id: string) {
    return this.clinicsService.deleteClinicServiceAssignment(id);
  }
}
