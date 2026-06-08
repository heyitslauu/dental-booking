import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServicesService } from "./services.service";

@Controller("services")
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
