import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { ClinicAccessInputDto } from "./dto/clinic-access-input.dto";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UpdateClinicAccessDto } from "./dto/update-clinic-access.dto";
import { UsersService } from "./users.service";

@Controller("admin/users")
@UseGuards(AdminJwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@CurrentUser() currentUser: CurrentUserType) {
    return this.usersService.findAll(currentUser);
  }

  @Post()
  create(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() dto: CreateAdminUserDto
  ) {
    return this.usersService.create(currentUser, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateAdminUserDto
  ) {
    return this.usersService.update(currentUser, id, dto);
  }

  @Post(":id/clinic-access")
  createClinicAccess(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: ClinicAccessInputDto
  ) {
    return this.usersService.createClinicAccess(currentUser, id, dto);
  }

  @Patch(":id/clinic-access/:accessId")
  updateClinicAccess(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Param("accessId") accessId: string,
    @Body() dto: UpdateClinicAccessDto
  ) {
    return this.usersService.updateClinicAccess(currentUser, id, accessId, dto);
  }

  @Delete(":id/clinic-access/:accessId")
  deactivateClinicAccess(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("id") id: string,
    @Param("accessId") accessId: string
  ) {
    return this.usersService.deactivateClinicAccess(currentUser, id, accessId);
  }
}
