import { Injectable } from "@nestjs/common";
import { ClinicAccessRole, UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const MANAGE_CLINIC_ROLES = new Set<ClinicAccessRole>([
  ClinicAccessRole.CLINIC_ADMIN,
  ClinicAccessRole.RECEPTIONIST,
]);

export type ClinicAccessEntry = {
  clinicId: string;
  role: ClinicAccessRole;
};

export type UserAccessContext = {
  accessibleClinicIds: string[];
  clinicAccess: ClinicAccessEntry[];
  isGlobalAdmin: boolean;
  manageableClinicIds: string[];
  role: UserRole | null;
  userId: string;
};

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccessibleClinicIds(userId: string) {
    const context = await this.getUserAccessContext(userId);

    return context.accessibleClinicIds;
  }

  async canAccessClinic(userId: string, clinicId: string) {
    const context = await this.getUserAccessContext(userId);

    if (context.isGlobalAdmin) {
      return true;
    }

    return context.accessibleClinicIds.includes(clinicId);
  }

  async canManageClinic(userId: string, clinicId: string) {
    const context = await this.getUserAccessContext(userId);

    if (context.isGlobalAdmin) {
      return true;
    }

    return context.manageableClinicIds.includes(clinicId);
  }

  async isGlobalAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return this.isGlobalAdminRole(user?.role);
  }

  async getUserAccessContext(userId: string): Promise<UserAccessContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        clinicAccess: {
          where: { isActive: true },
          select: {
            clinicId: true,
            role: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!user) {
      return {
        accessibleClinicIds: [],
        clinicAccess: [],
        isGlobalAdmin: false,
        manageableClinicIds: [],
        role: null,
        userId,
      };
    }

    const isGlobalAdmin = this.isGlobalAdminRole(user.role);

    if (isGlobalAdmin) {
      const clinics = await this.prisma.clinic.findMany({
        select: { id: true },
        orderBy: { createdAt: "asc" },
      });
      const clinicIds = clinics.map((clinic) => clinic.id);

      return {
        accessibleClinicIds: clinicIds,
        clinicAccess: user.clinicAccess,
        isGlobalAdmin,
        manageableClinicIds: clinicIds,
        role: user.role,
        userId: user.id,
      };
    }

    if (user.role !== UserRole.STAFF) {
      return {
        accessibleClinicIds: [],
        clinicAccess: [],
        isGlobalAdmin: false,
        manageableClinicIds: [],
        role: user.role,
        userId: user.id,
      };
    }

    const accessibleClinicIds = unique(
      user.clinicAccess.map((access) => access.clinicId),
    );
    const manageableClinicIds = unique(
      user.clinicAccess
        .filter((access) => MANAGE_CLINIC_ROLES.has(access.role))
        .map((access) => access.clinicId),
    );

    return {
      accessibleClinicIds,
      clinicAccess: user.clinicAccess,
      isGlobalAdmin: false,
      manageableClinicIds,
      role: user.role,
      userId: user.id,
    };
  }

  private isGlobalAdminRole(role: UserRole | null | undefined) {
    return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN;
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}
