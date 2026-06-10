import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClinicAccessRole, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { AccessControlService } from "../access-control/access-control.service";
import type { CurrentUser } from "../auth/current-user";
import { PrismaService } from "../prisma/prisma.service";
import { ClinicAccessInputDto } from "./dto/clinic-access-input.dto";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UpdateClinicAccessDto } from "./dto/update-clinic-access.dto";

const userInclude = {
  clinicAccess: {
    include: { clinic: true },
    orderBy: { createdAt: "asc" },
  },
  staffProfile: true,
} satisfies Prisma.UserInclude;

type UserWithManagementRelations = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async findAll(currentUser: CurrentUser) {
    await this.ensureCanUseUserManagement(currentUser);

    const where = await this.getUserListWhere(currentUser);
    const users = await this.prisma.user.findMany({
      where,
      include: userInclude,
      orderBy: { email: "asc" },
    });

    return users.map(toUserResponse);
  }

  async create(currentUser: CurrentUser, dto: CreateAdminUserDto) {
    await this.ensureCanManageUserRole(currentUser, dto.role);
    await this.ensureCanManageClinicAccessInputs(currentUser, dto.clinicAccess ?? []);

    const email = normalizeEmail(dto.email);
    const password = dto.password.trim();

    if (!password) {
      throw new BadRequestException("Password is required.");
    }

    const shouldCreateStaffProfile = Boolean(
      dto.firstName?.trim() || dto.lastName?.trim() || dto.title?.trim(),
    );

    if (dto.role === UserRole.STAFF && shouldCreateStaffProfile) {
      this.ensureStaffProfileNames(dto.firstName, dto.lastName);
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: dto.role,
        ...(dto.role === UserRole.STAFF && shouldCreateStaffProfile
          ? {
              staffProfile: {
                create: {
                  firstName: dto.firstName!.trim(),
                  lastName: dto.lastName!.trim(),
                  title: dto.title?.trim() || null,
                },
              },
            }
          : {}),
        clinicAccess: dto.clinicAccess?.length
          ? {
              create: dto.clinicAccess.map((access) => ({
                clinicId: access.clinicId,
                role: access.role,
                isActive: access.isActive ?? true,
              })),
            }
          : undefined,
      },
      include: userInclude,
    });

    return toUserResponse(user);
  }

  async update(currentUser: CurrentUser, userId: string, dto: UpdateAdminUserDto) {
    const existingUser = await this.ensureUserExists(userId);
    const nextRole = dto.role ?? existingUser.role;

    await this.ensureCanManageUserRole(currentUser, existingUser.role);
    await this.ensureCanManageUserRole(currentUser, nextRole);

    const password = dto.password?.trim();
    const shouldUpdateStaffProfile =
      dto.firstName !== undefined ||
      dto.lastName !== undefined ||
      dto.title !== undefined ||
      dto.isStaffActive !== undefined;

    if (shouldUpdateStaffProfile && nextRole !== UserRole.STAFF) {
      throw new BadRequestException("Only staff users can have staff profile details.");
    }

    if (shouldUpdateStaffProfile) {
      await this.ensureStaffProfileForUpdate(userId, dto);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email === undefined ? undefined : normalizeEmail(dto.email),
        passwordHash: password ? await bcrypt.hash(password, 12) : undefined,
        role: dto.role,
      },
      include: userInclude,
    });

    return toUserResponse(user);
  }

  async createClinicAccess(
    currentUser: CurrentUser,
    userId: string,
    dto: ClinicAccessInputDto,
  ) {
    await this.ensureCanManageTargetUser(currentUser, userId);
    await this.ensureCanManageClinicAccessInputs(currentUser, [dto]);

    const access = await this.prisma.userClinicAccess.create({
      data: {
        userId,
        clinicId: dto.clinicId,
        role: dto.role,
        isActive: dto.isActive ?? true,
      },
      include: { clinic: true },
    });

    return access;
  }

  async updateClinicAccess(
    currentUser: CurrentUser,
    userId: string,
    accessId: string,
    dto: UpdateClinicAccessDto,
  ) {
    await this.ensureCanManageTargetUser(currentUser, userId);
    const access = await this.ensureClinicAccessExists(userId, accessId);

    await this.ensureCanManageClinicAccessInputs(currentUser, [
      {
        clinicId: access.clinicId,
        role: dto.role ?? access.role,
        isActive: dto.isActive ?? access.isActive,
      },
    ]);

    return this.prisma.userClinicAccess.update({
      where: { id: accessId },
      data: {
        role: dto.role,
        isActive: dto.isActive,
      },
      include: { clinic: true },
    });
  }

  async deactivateClinicAccess(
    currentUser: CurrentUser,
    userId: string,
    accessId: string,
  ) {
    return this.updateClinicAccess(currentUser, userId, accessId, {
      isActive: false,
    });
  }

  private async ensureCanUseUserManagement(currentUser: CurrentUser) {
    if (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ORG_ADMIN) {
      return;
    }

    throw new ForbiddenException("You cannot manage users.");
  }

  private async ensureCanManageTargetUser(currentUser: CurrentUser, targetUserId: string) {
    const targetUser = await this.ensureUserExists(targetUserId);

    await this.ensureCanManageUserRole(currentUser, targetUser.role);
  }

  private async ensureCanManageUserRole(currentUser: CurrentUser, role: UserRole) {
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return;
    }

    if (
      currentUser.role === UserRole.ORG_ADMIN &&
      (role === UserRole.STAFF || role === UserRole.PATIENT)
    ) {
      return;
    }

    throw new ForbiddenException("You cannot manage users with this role.");
  }

  private async ensureCanManageClinicAccessInputs(
    currentUser: CurrentUser,
    clinicAccess: ClinicAccessInputDto[],
  ) {
    if (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ORG_ADMIN) {
      return;
    }

    for (const access of clinicAccess) {
      const canManageClinic = await this.accessControlService.canManageClinic(
        currentUser.userId,
        access.clinicId,
      );

      if (!canManageClinic) {
        throw new ForbiddenException("You cannot manage access for this clinic.");
      }
    }
  }

  private async getUserListWhere(
    currentUser: CurrentUser,
  ): Promise<Prisma.UserWhereInput | undefined> {
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return undefined;
    }

    if (currentUser.role === UserRole.ORG_ADMIN) {
      return {
        role: { in: [UserRole.STAFF, UserRole.PATIENT] },
      };
    }

    throw new ForbiddenException("You cannot manage users.");
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  private async ensureClinicAccessExists(userId: string, accessId: string) {
    const access = await this.prisma.userClinicAccess.findFirst({
      where: { id: accessId, userId },
    });

    if (!access) {
      throw new NotFoundException("Clinic access record not found.");
    }

    return access;
  }

  private ensureStaffProfileNames(firstName?: string, lastName?: string) {
    if (!firstName?.trim() || !lastName?.trim()) {
      throw new BadRequestException("Staff first and last name are required.");
    }
  }

  private async ensureStaffProfileForUpdate(
    userId: string,
    dto: UpdateAdminUserDto,
  ) {
    const staffProfile = await this.prisma.staffProfile.findUnique({
      where: { userId },
    });

    if (!staffProfile) {
      this.ensureStaffProfileNames(dto.firstName, dto.lastName);

      await this.prisma.staffProfile.create({
        data: {
          userId,
          firstName: dto.firstName!.trim(),
          lastName: dto.lastName!.trim(),
          title: dto.title?.trim() || null,
          isActive: dto.isStaffActive ?? true,
        },
      });
      return;
    }

    const nextFirstName =
      dto.firstName === undefined ? undefined : dto.firstName.trim();
    const nextLastName =
      dto.lastName === undefined ? undefined : dto.lastName.trim();

    if (dto.firstName !== undefined && !nextFirstName) {
      throw new BadRequestException("Staff first name is required.");
    }

    if (dto.lastName !== undefined && !nextLastName) {
      throw new BadRequestException("Staff last name is required.");
    }

    await this.prisma.staffProfile.update({
      where: { id: staffProfile.id },
      data: {
        firstName: nextFirstName,
        lastName: nextLastName,
        title: dto.title === undefined ? undefined : dto.title.trim() || null,
        isActive: dto.isStaffActive,
      },
    });
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toUserResponse(user: UserWithManagementRelations) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    staffProfile: user.staffProfile,
    clinicAccess: user.clinicAccess,
  };
}
