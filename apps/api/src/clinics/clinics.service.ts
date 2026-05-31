import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClinicServiceDto } from "./dto/create-clinic-service.dto";
import { CreateClinicStaffDto } from "./dto/create-clinic-staff.dto";
import { UpdateClinicServiceDto } from "./dto/update-clinic-service.dto";
import { UpdateClinicStaffDto } from "./dto/update-clinic-staff.dto";

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  findActiveClinics() {
    return this.prisma.clinic.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }

  findServicesByClinic(clinicId: string) {
    return this.prisma.clinicService.findMany({
      where: {
        clinicId,
        isActive: true,
        clinic: { isActive: true },
        service: { isActive: true }
      },
      include: { service: true },
      orderBy: { service: { name: "asc" } }
    });
  }

  findStaffByClinic(clinicId: string) {
    return this.prisma.clinicStaff.findMany({
      where: {
        clinicId,
        isActive: true,
        clinic: { isActive: true },
        staffProfile: { isActive: true }
      },
      include: { staffProfile: true },
      orderBy: { staffProfile: { lastName: "asc" } }
    });
  }

  findClinicServiceAssignments(clinicId?: string) {
    return this.prisma.clinicService.findMany({
      where: clinicId ? { clinicId } : undefined,
      include: {
        clinic: true,
        service: true
      },
      orderBy: [{ clinic: { name: "asc" } }, { service: { name: "asc" } }]
    });
  }

  async createClinicServiceAssignment(dto: CreateClinicServiceDto) {
    await this.ensureClinicExists(dto.clinicId);
    await this.ensureServiceExists(dto.serviceId);

    return this.prisma.clinicService.create({
      data: dto,
      include: { clinic: true, service: true }
    });
  }

  updateClinicServiceAssignment(id: string, dto: UpdateClinicServiceDto) {
    return this.prisma.clinicService.update({
      where: { id },
      data: dto,
      include: { clinic: true, service: true }
    });
  }

  deleteClinicServiceAssignment(id: string) {
    return this.prisma.clinicService.delete({
      where: { id }
    });
  }

  findClinicStaffAssignments(clinicId?: string) {
    return this.prisma.clinicStaff.findMany({
      where: clinicId ? { clinicId } : undefined,
      include: {
        clinic: true,
        staffProfile: true
      },
      orderBy: [{ clinic: { name: "asc" } }, { staffProfile: { lastName: "asc" } }]
    });
  }

  async createClinicStaffAssignment(dto: CreateClinicStaffDto) {
    await this.ensureClinicExists(dto.clinicId);
    await this.ensureStaffExists(dto.staffProfileId);

    return this.prisma.clinicStaff.create({
      data: dto,
      include: { clinic: true, staffProfile: true }
    });
  }

  updateClinicStaffAssignment(id: string, dto: UpdateClinicStaffDto) {
    return this.prisma.clinicStaff.update({
      where: { id },
      data: dto,
      include: { clinic: true, staffProfile: true }
    });
  }

  deleteClinicStaffAssignment(id: string) {
    return this.prisma.clinicStaff.delete({
      where: { id }
    });
  }

  async ensureClinicExists(clinicId: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId }
    });

    if (!clinic) {
      throw new NotFoundException("Clinic not found.");
    }

    return clinic;
  }

  async ensureServiceOfferedByClinic(clinicId: string, serviceId: string) {
    const assignment = await this.prisma.clinicService.findUnique({
      where: {
        clinicId_serviceId: {
          clinicId,
          serviceId
        }
      }
    });

    if (!assignment || !assignment.isActive) {
      throw new BadRequestException(
        "Selected service is not offered by the selected clinic."
      );
    }

    return assignment;
  }

  async ensureStaffAssignedToClinic(clinicId: string, staffProfileId: string) {
    const assignment = await this.prisma.clinicStaff.findUnique({
      where: {
        clinicId_staffProfileId: {
          clinicId,
          staffProfileId
        }
      }
    });

    if (!assignment || !assignment.isActive) {
      throw new BadRequestException(
        "Selected staff member is not assigned to the selected clinic."
      );
    }

    return assignment;
  }

  private async ensureServiceExists(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException("Service not found.");
    }
  }

  private async ensureStaffExists(staffProfileId: string) {
    const staff = await this.prisma.staffProfile.findUnique({
      where: { id: staffProfileId }
    });

    if (!staff) {
      throw new NotFoundException("Staff profile not found.");
    }
  }
}
