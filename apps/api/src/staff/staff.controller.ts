import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";
import { StaffService } from "./staff.service";

@Controller("staff")
@UseGuards(AdminJwtGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("admin")
  findAll(@CurrentUser() currentUser: CurrentUserType) {
    return this.staffService.findAll(currentUser);
  }

  @Post("admin")
  create(@CurrentUser() currentUser: CurrentUserType, @Body() dto: CreateStaffProfileDto) {
    return this.staffService.create(dto, currentUser);
  }

  @Patch("admin/:staffProfileId")
  update(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("staffProfileId") staffProfileId: string,
    @Body() dto: UpdateStaffProfileDto
  ) {
    return this.staffService.update(staffProfileId, dto, currentUser);
  }
}
