import { IsBoolean, IsOptional } from "class-validator";

export class UpdateClinicStaffDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
