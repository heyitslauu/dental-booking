import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.staffProfile.findMany({
      include: {
        clinicStaff: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }]
    });
  }

  create(dto: CreateStaffProfileDto) {
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

  async update(staffProfileId: string, dto: UpdateStaffProfileDto) {
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
}
