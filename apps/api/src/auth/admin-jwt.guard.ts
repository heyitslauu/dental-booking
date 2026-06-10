import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { CurrentUser } from "./current-user";
import { verifyAccessToken } from "./jwt";

@Injectable()
export class AdminJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: CurrentUser;
    }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Admin login is required.");
    }

    const payload = verifyAccessToken(authorization.slice("Bearer ".length));

    request.user = {
      email: payload.email,
      id: payload.sub,
      role: payload.role,
      userId: payload.sub,
    };

    return true;
  }
}
