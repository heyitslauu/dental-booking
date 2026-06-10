import { ClinicAccessRole } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class ClinicAccessInputDto {
  @IsString()
  clinicId: string;

  @IsEnum(ClinicAccessRole)
  role: ClinicAccessRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
