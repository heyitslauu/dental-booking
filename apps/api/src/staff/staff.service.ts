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
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService
  ) {}

  async findAll(currentUser: CurrentUser) {
    const staffWhere = await this.getStaffListWhere(currentUser.userId);

    return this.prisma.staffProfile.findMany({
      where: staffWhere,
      include: {
        clinicStaff: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }]
    });
  }

  async create(dto: CreateStaffProfileDto, currentUser?: CurrentUser) {
    if (currentUser) {
      await this.ensureGlobalAdmin(currentUser.userId);
    }

    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException("Staff first and last name are required.");
    }

    return this.prisma.staffProfile.create({
      data: {
        firstName,
        lastName,
        title: dto.title?.trim() || null,
        isActive: dto.isActive
      },
      include: {
        clinicStaff: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      }
    });
  }

  async update(
    staffProfileId: string,
    dto: UpdateStaffProfileDto,
    currentUser?: CurrentUser
  ) {
    if (currentUser) {
      await this.ensureGlobalAdmin(currentUser.userId);
    }

    await this.ensureStaffExists(staffProfileId);

    const firstName =
      dto.firstName === undefined ? undefined : dto.firstName.trim();
    const lastName = dto.lastName === undefined ? undefined : dto.lastName.trim();

    if (dto.firstName !== undefined && !firstName) {
      throw new BadRequestException("Staff first name is required.");
    }

    if (dto.lastName !== undefined && !lastName) {
      throw new BadRequestException("Staff last name is required.");
    }

    return this.prisma.staffProfile.update({
      where: { id: staffProfileId },
      data: {
        firstName,
        lastName,
        title: dto.title === undefined ? undefined : dto.title?.trim() || null,
        isActive: dto.isActive
      },
      include: {
        clinicStaff: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      }
    });
  }

  private async ensureStaffExists(staffProfileId: string) {
    const staffProfile = await this.prisma.staffProfile.findUnique({
      where: { id: staffProfileId }
    });

    if (!staffProfile) {
      throw new NotFoundException("Staff profile not found.");
    }
  }

  private async getStaffListWhere(
    userId: string
  ): Promise<Prisma.StaffProfileWhereInput | undefined> {
    const context = await this.accessControlService.getUserAccessContext(userId);

    if (context.isGlobalAdmin) {
      return undefined;
    }

    if (context.accessibleClinicIds.length === 0) {
      throw new ForbiddenException("You do not have access to any clinics.");
    }

    return {
      clinicStaff: {
        some: {
          clinicId: { in: context.accessibleClinicIds }
        }
      }
    };
  }

  private async ensureGlobalAdmin(userId: string) {
    const isGlobalAdmin = await this.accessControlService.isGlobalAdmin(userId);

    if (!isGlobalAdmin) {
      throw new ForbiddenException("Only global admins can manage staff profiles.");
    }
  }
}
