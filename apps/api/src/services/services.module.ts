import { Module } from "@nestjs/common";
import { AccessControlModule } from "../access-control/access-control.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
  imports: [AccessControlModule, PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
