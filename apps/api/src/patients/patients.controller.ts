import { Body, Controller, Post } from "@nestjs/common";
import { CreatePatientProfileDto } from "./dto/create-patient-profile.dto";
import { PatientsService } from "./patients.service";

@Controller("patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: CreatePatientProfileDto) {
    return this.patientsService.create(dto);
  }
}
