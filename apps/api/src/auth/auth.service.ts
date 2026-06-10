import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { signAccessToken } from "./jwt";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
      include: {
        clinicAccess: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    const canUseAdminDashboard =
      user?.role === UserRole.SUPER_ADMIN ||
      user?.role === UserRole.ORG_ADMIN ||
      (user?.role === UserRole.STAFF && user.clinicAccess.length > 0);

    if (!user || !canUseAdminDashboard || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return {
      accessToken: signAccessToken({
        email: user.email,
        role: user.role,
        sub: user.id,
      }),
      user: {
        email: user.email,
        id: user.id,
        role: user.role,
      },
    };
  }
}
