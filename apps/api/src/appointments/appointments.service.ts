import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { AccessControlService } from "../access-control/access-control.service";
import type { CurrentUser } from "../auth/current-user";
import { ClinicsService } from "../clinics/clinics.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { ListAppointmentsDto } from "./dto/list-appointments.dto";

const appointmentInclude = {
  clinic: true,
  service: true,
  patientProfile: true,
  staffProfile: true
} as const;

function generateReferenceNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let referenceNumber = "";

  for (let index = 0; index < 6; index += 1) {
    referenceNumber += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return referenceNumber;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicsService: ClinicsService,
    private readonly accessControlService: AccessControlService
  ) {}

  async findMany(query: ListAppointmentsDto, currentUser: CurrentUser) {
    const startAt: Record<string, Date> = {};
    const clinicIdFilter = await this.getAppointmentClinicFilter(
      currentUser.userId,
      query.clinicId
    );

    if (query.from) {
      startAt.gte = new Date(query.from);
    }

    if (query.to) {
      startAt.lte = new Date(query.to);
    }

    return this.prisma.appointment.findMany({
      where: {
        clinicId: clinicIdFilter,
        status: query.status,
        startAt: Object.keys(startAt).length ? startAt : undefined
      },
      include: appointmentInclude,
      orderBy: { startAt: "asc" }
    });
  }

  async findByReferenceNumber(referenceNumber: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { referenceNumber: referenceNumber.trim().toUpperCase() },
      include: appointmentInclude
    });

    if (!appointment) {
      throw new NotFoundException("Appointment reference not found.");
    }

    return appointment;
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

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const referenceNumber = generateReferenceNumber();

      try {
        return await this.prisma.appointment.create({
          data: {
            referenceNumber,
            clinicId: dto.clinicId,
            serviceId: dto.serviceId,
            patientProfileId: dto.patientId,
            staffProfileId: dto.staffId,
            startAt,
            endAt,
            notes: dto.notes
          },
          include: appointmentInclude
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new BadRequestException("Unable to generate appointment reference.");
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    currentUser: CurrentUser
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      select: { clinicId: true }
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found.");
    }

    const canManageClinic = await this.accessControlService.canManageClinic(
      currentUser.userId,
      appointment.clinicId
    );

    if (!canManageClinic) {
      throw new ForbiddenException("You cannot manage appointments for this clinic.");
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: appointmentInclude
    });
  }

  private async getAppointmentClinicFilter(
    userId: string,
    requestedClinicId?: string
  ): Promise<string | Prisma.StringFilter | undefined> {
    const context = await this.accessControlService.getUserAccessContext(userId);

    if (context.isGlobalAdmin) {
      return requestedClinicId;
    }

    if (context.accessibleClinicIds.length === 0) {
      throw new ForbiddenException("You do not have access to any clinics.");
    }

    if (requestedClinicId) {
      if (!context.accessibleClinicIds.includes(requestedClinicId)) {
        throw new ForbiddenException("You cannot access appointments for this clinic.");
      }

      return requestedClinicId;
    }

    return { in: context.accessibleClinicIds };
  }
}
