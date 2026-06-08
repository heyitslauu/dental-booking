import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyAccessToken } from "./jwt";

@Injectable()
export class AdminJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: unknown;
    }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Admin login is required.");
    }

    request.user = verifyAccessToken(authorization.slice("Bearer ".length));

    return true;
  }
}
