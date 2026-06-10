import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { ListAppointmentsDto } from "./dto/list-appointments.dto";
import { UpdateAppointmentStatusDto } from "./dto/update-appointment-status.dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @UseGuards(AdminJwtGuard)
  findMany(
    @CurrentUser() currentUser: CurrentUserType,
    @Query() query: ListAppointmentsDto
  ) {
    return this.appointmentsService.findMany(query, currentUser);
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get("reference/:referenceNumber")
  findByReferenceNumber(@Param("referenceNumber") referenceNumber: string) {
    return this.appointmentsService.findByReferenceNumber(referenceNumber);
  }

  @Patch(":id/status")
  @UseGuards(AdminJwtGuard)
  updateStatus(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateAppointmentStatusDto
  ) {
    return this.appointmentsService.updateStatus(id, dto.status, currentUser);
  }
}
