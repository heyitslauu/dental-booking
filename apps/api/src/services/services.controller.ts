import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/admin-jwt.guard";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServicesService } from "./services.service";

@Controller("services")
@UseGuards(AdminJwtGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get("admin")
  findAll() {
    return this.servicesService.findAll();
  }

  @Post("admin")
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch("admin/:serviceId")
  update(@Param("serviceId") serviceId: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(serviceId, dto);
  }
}
