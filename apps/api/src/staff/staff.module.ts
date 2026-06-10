import { Module } from "@nestjs/common";
import { AccessControlModule } from "../access-control/access-control.module";
import { PrismaModule } from "../prisma/prisma.module";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";

@Module({
  imports: [AccessControlModule, PrismaModule],
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
