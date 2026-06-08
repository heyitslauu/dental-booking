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
      where: { email: dto.email.trim().toLowerCase() }
    });

    if (!user || user.role !== UserRole.ADMIN || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return {
      accessToken: signAccessToken({
        email: user.email,
        role: user.role,
        sub: user.id
      }),
      user: {
        email: user.email,
        id: user.id,
        role: user.role
      }
    };
  }
}
