import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePatientProfileDto } from "./dto/create-patient-profile.dto";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePatientProfileDto) {
    return this.prisma.patientProfile.create({
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined
      }
    });
  }
}
