import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany({
      include: {
        clinicServices: {
          include: { clinic: true },
          orderBy: { clinic: { name: "asc" } }
        }
      },
      orderBy: { name: "asc" }
    });
  }

  create(dto: CreateServiceDto) {
    const name = dto.name.trim();

    if (!name) {
      throw new BadRequestException("Service name is required.");
    }

    return this.prisma.service.create({
      data: {
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

  async update(serviceId: string, dto: UpdateServiceDto) {
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
}
