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
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService
  ) {}

  async findAll(currentUser: CurrentUser) {
    const serviceWhere = await this.getServiceListWhere(currentUser.userId);

    return this.prisma.service.findMany({
      where: serviceWhere,
      include: {
        clinicServices: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      },
      orderBy: { name: "asc" }
    });
  }

  async create(dto: CreateServiceDto, currentUser?: CurrentUser) {
    if (currentUser) {
      await this.ensureGlobalAdmin(currentUser.userId);
    }

    const name = dto.name.trim();

    if (!name) {
      throw new BadRequestException("Service name is required.");
    }

    const organization = await this.prisma.organization.findFirst({
      orderBy: { createdAt: "asc" }
    });

    if (!organization) {
      throw new BadRequestException("Create an organization before adding services.");
    }

    return this.prisma.service.create({
      data: {
        organizationId: organization.id,
        name,
        description: dto.description?.trim() || null,
        isActive: dto.isActive
      },
      include: {
        clinicServices: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      }
    });
  }

  async update(
    serviceId: string,
    dto: UpdateServiceDto,
    currentUser?: CurrentUser
  ) {
    if (currentUser) {
      await this.ensureGlobalAdmin(currentUser.userId);
    }

    await this.ensureServiceExists(serviceId);

    const name = dto.name === undefined ? undefined : dto.name.trim();

    if (dto.name !== undefined && !name) {
      throw new BadRequestException("Service name is required.");
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description:
          dto.description === undefined ? undefined : dto.description?.trim() || null,
        isActive: dto.isActive
      },
      include: {
        clinicServices: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      }
    });
  }

  private async ensureServiceExists(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException("Service not found.");
    }
  }

  private async getServiceListWhere(
    userId: string
  ): Promise<Prisma.ServiceWhereInput | undefined> {
    const context = await this.accessControlService.getUserAccessContext(userId);

    if (context.isGlobalAdmin) {
      return undefined;
    }

    if (context.accessibleClinicIds.length === 0) {
      throw new ForbiddenException("You do not have access to any clinics.");
    }

    return {
      clinicServices: {
        some: {
          clinicId: { in: context.accessibleClinicIds }
        }
      }
    };
  }

  private async ensureGlobalAdmin(userId: string) {
    const isGlobalAdmin = await this.accessControlService.isGlobalAdmin(userId);

    if (!isGlobalAdmin) {
      throw new ForbiddenException("Only global admins can manage service definitions.");
    }
  }
}
