import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateClinicStaffDto {
  @IsString()
  clinicId: string;

  @IsString()
  staffProfileId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
