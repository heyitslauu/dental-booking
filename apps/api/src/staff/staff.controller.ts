import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";
import { StaffService } from "./staff.service";

@Controller("staff")
@UseGuards(AdminJwtGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("admin")
  findAll() {
    return this.staffService.findAll();
  }

  @Post("admin")
  create(@Body() dto: CreateStaffProfileDto) {
    return this.staffService.create(dto);
  }

  @Patch("admin/:staffProfileId")
  update(
    @Param("staffProfileId") staffProfileId: string,
    @Body() dto: UpdateStaffProfileDto
  ) {
    return this.staffService.update(staffProfileId, dto);
  }
}
