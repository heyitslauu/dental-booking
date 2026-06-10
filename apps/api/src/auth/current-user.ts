import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export type CurrentUser = {
  email: string;
  id: string;
  role: UserRole;
  userId: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<{
      user?: CurrentUser;
    }>();

    if (!request.user) {
      throw new Error("CurrentUser decorator requires an authenticated request.");
    }

    return request.user;
  },
);
