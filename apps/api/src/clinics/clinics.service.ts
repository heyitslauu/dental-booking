import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccessControlService } from "../access-control/access-control.service";
import type { CurrentUser } from "../auth/current-user";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { CreateClinicServiceDto } from "./dto/create-clinic-service.dto";
import { CreateClinicStaffDto } from "./dto/create-clinic-staff.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { UpdateClinicServiceDto } from "./dto/update-clinic-service.dto";
import { UpdateClinicStaffDto } from "./dto/update-clinic-staff.dto";

function getSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

@Injectable()
export class ClinicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService
  ) {}

  findActiveClinics() {
    return this.prisma.clinic.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }

  async findAllClinics(currentUser: CurrentUser) {
    const clinicIdFilter = await this.getClinicIdFilter(currentUser.userId);

    return this.prisma.clinic.findMany({
      where: { id: clinicIdFilter },
      orderBy: { name: "asc" }
    });
  }

  async createClinic(dto: CreateClinicDto, currentUser?: CurrentUser) {
    if (currentUser) {
      await this.ensureGlobalAdmin(currentUser.userId);
    }

    const organization = await this.prisma.organization.findFirst({
      orderBy: { createdAt: "asc" }
    });

    if (!organization) {
      throw new BadRequestException("Create an organization before adding clinics.");
    }

    const slug = getSlug(dto.slug || dto.name);

    if (!slug) {
      throw new BadRequestException("Clinic slug is required.");
    }

    return this.prisma.clinic.create({
      data: {
        organizationId: organization.id,
        name: dto.name.trim(),
        slug,
        address: dto.address?.trim() || null,
        phone: dto.phone?.trim() || null
      }
    });
  }

  async updateClinic(
    clinicId: string,
    dto: UpdateClinicDto,
    currentUser?: CurrentUser
  ) {
    await this.ensureClinicExists(clinicId);

    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, clinicId);
    }

    const nextSlug = dto.slug === undefined ? undefined : getSlug(dto.slug);

    if (dto.slug !== undefined && !nextSlug) {
      throw new BadRequestException("Clinic slug is required.");
    }

    return this.prisma.clinic.update({
      where: { id: clinicId },
      data: {
        name: dto.name?.trim(),
        slug: nextSlug,
        address: dto.address === undefined ? undefined : dto.address.trim() || null,
        phone: dto.phone === undefined ? undefined : dto.phone.trim() || null,
        isActive: dto.isActive
      }
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

  async findClinicServiceAssignments(
    clinicId?: string,
    currentUser?: CurrentUser
  ) {
    const clinicIdFilter = currentUser
      ? await this.getClinicIdFilter(currentUser.userId, clinicId)
      : clinicId;

    return this.prisma.clinicService.findMany({
      where: clinicIdFilter ? { clinicId: clinicIdFilter } : undefined,
      include: {
        clinic: true,
        service: true
      },
      orderBy: [{ clinic: { name: "asc" } }, { service: { name: "asc" } }]
    });
  }

  async createClinicServiceAssignment(
    dto: CreateClinicServiceDto,
    currentUser?: CurrentUser
  ) {
    await this.ensureClinicExists(dto.clinicId);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, dto.clinicId);
    }
    await this.ensureServiceExists(dto.serviceId);

    return this.prisma.clinicService.create({
      data: dto,
      include: { clinic: true, service: true }
    });
  }

  async updateClinicServiceAssignment(
    id: string,
    dto: UpdateClinicServiceDto,
    currentUser?: CurrentUser
  ) {
    const assignment = await this.ensureClinicServiceAssignmentExists(id);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, assignment.clinicId);
    }

    return this.prisma.clinicService.update({
      where: { id },
      data: dto,
      include: { clinic: true, service: true }
    });
  }

  async deleteClinicServiceAssignment(id: string, currentUser?: CurrentUser) {
    const assignment = await this.ensureClinicServiceAssignmentExists(id);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, assignment.clinicId);
    }

    return this.prisma.clinicService.delete({
      where: { id }
    });
  }

  async findClinicStaffAssignments(clinicId?: string, currentUser?: CurrentUser) {
    const clinicIdFilter = currentUser
      ? await this.getClinicIdFilter(currentUser.userId, clinicId)
      : clinicId;

    return this.prisma.clinicStaff.findMany({
      where: clinicIdFilter ? { clinicId: clinicIdFilter } : undefined,
      include: {
        clinic: true,
        staffProfile: true
      },
      orderBy: [{ clinic: { name: "asc" } }, { staffProfile: { lastName: "asc" } }]
    });
  }

  async createClinicStaffAssignment(
    dto: CreateClinicStaffDto,
    currentUser?: CurrentUser
  ) {
    await this.ensureClinicExists(dto.clinicId);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, dto.clinicId);
    }
    await this.ensureStaffExists(dto.staffProfileId);

    return this.prisma.clinicStaff.create({
      data: dto,
      include: { clinic: true, staffProfile: true }
    });
  }

  async updateClinicStaffAssignment(
    id: string,
    dto: UpdateClinicStaffDto,
    currentUser?: CurrentUser
  ) {
    const assignment = await this.ensureClinicStaffAssignmentExists(id);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, assignment.clinicId);
    }

    return this.prisma.clinicStaff.update({
      where: { id },
      data: dto,
      include: { clinic: true, staffProfile: true }
    });
  }

  async deleteClinicStaffAssignment(id: string, currentUser?: CurrentUser) {
    const assignment = await this.ensureClinicStaffAssignmentExists(id);
    if (currentUser) {
      await this.ensureCanManageClinic(currentUser.userId, assignment.clinicId);
    }

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

  private async getClinicIdFilter(
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
        throw new ForbiddenException("You cannot access this clinic.");
      }

      return requestedClinicId;
    }

    return { in: context.accessibleClinicIds };
  }

  private async ensureCanManageClinic(userId: string, clinicId: string) {
    const canManageClinic = await this.accessControlService.canManageClinic(
      userId,
      clinicId
    );

    if (!canManageClinic) {
      throw new ForbiddenException("You cannot manage this clinic.");
    }
  }

  private async ensureGlobalAdmin(userId: string) {
    const isGlobalAdmin = await this.accessControlService.isGlobalAdmin(userId);

    if (!isGlobalAdmin) {
      throw new ForbiddenException("Only global admins can create clinics.");
    }
  }

  private async ensureClinicServiceAssignmentExists(id: string) {
    const assignment = await this.prisma.clinicService.findUnique({
      where: { id },
      select: { clinicId: true }
    });

    if (!assignment) {
      throw new NotFoundException("Clinic service assignment not found.");
    }

    return assignment;
  }

  private async ensureClinicStaffAssignmentExists(id: string) {
    const assignment = await this.prisma.clinicStaff.findUnique({
      where: { id },
      select: { clinicId: true }
    });

    if (!assignment) {
      throw new NotFoundException("Clinic staff assignment not found.");
    }

    return assignment;
  }
}
