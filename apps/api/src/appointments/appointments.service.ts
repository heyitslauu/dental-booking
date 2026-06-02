import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AppointmentStatus } from "@prisma/client";
import { ClinicsService } from "../clinics/clinics.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { ListAppointmentsDto } from "./dto/list-appointments.dto";

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicsService: ClinicsService
  ) {}

  async findMany(query: ListAppointmentsDto) {
    const startAt: Record<string, Date> = {};

    if (query.from) {
      startAt.gte = new Date(query.from);
    }

    if (query.to) {
      startAt.lte = new Date(query.to);
    }

    return this.prisma.appointment.findMany({
      where: {
        clinicId: query.clinicId,
        status: query.status,
        startAt: Object.keys(startAt).length ? startAt : undefined
      },
      include: {
        clinic: true,
        service: true,
        patientProfile: true,
        staffProfile: true
      },
      orderBy: { startAt: "asc" }
    });
  }

  async create(dto: CreateAppointmentDto) {
    if (!dto.clinicId) {
      throw new BadRequestException("Appointment requires clinicId.");
    }

    await this.clinicsService.ensureClinicExists(dto.clinicId);
    await this.clinicsService.ensureServiceOfferedByClinic(
      dto.clinicId,
      dto.serviceId
    );

    if (dto.staffId) {
      await this.clinicsService.ensureStaffAssignedToClinic(
        dto.clinicId,
        dto.staffId
      );
    }

    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId }
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found.");
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      throw new BadRequestException(
        "Appointment startAt and endAt must be valid dates."
      );
    }

    if (endAt <= startAt) {
      throw new BadRequestException("Appointment endAt must be after startAt.");
    }

    return this.prisma.appointment.create({
      data: {
        clinicId: dto.clinicId,
        serviceId: dto.serviceId,
        patientProfileId: dto.patientId,
        staffProfileId: dto.staffId,
        startAt,
        endAt,
        notes: dto.notes
      },
      include: {
        clinic: true,
        service: true,
        patientProfile: true,
        staffProfile: true
      }
    });
  }

  updateStatus(id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        clinic: true,
        service: true,
        patientProfile: true,
        staffProfile: true
      }
    });
  }
}
