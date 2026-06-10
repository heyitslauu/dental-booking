import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CurrentUser, type CurrentUser as CurrentUserType } from "../auth/current-user";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServicesService } from "./services.service";

@Controller("services")
@UseGuards(AdminJwtGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get("admin")
  findAll(@CurrentUser() currentUser: CurrentUserType) {
    return this.servicesService.findAll(currentUser);
  }

  @Post("admin")
  create(@CurrentUser() currentUser: CurrentUserType, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto, currentUser);
  }

  @Patch("admin/:serviceId")
  update(
    @CurrentUser() currentUser: CurrentUserType,
    @Param("serviceId") serviceId: string,
    @Body() dto: UpdateServiceDto
  ) {
    return this.servicesService.update(serviceId, dto, currentUser);
  }
}
