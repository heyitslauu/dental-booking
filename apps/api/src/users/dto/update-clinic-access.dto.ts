import { ClinicAccessRole } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

export class UpdateClinicAccessDto {
  @IsEnum(ClinicAccessRole)
  @IsOptional()
  role?: ClinicAccessRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
