import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateStaffProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  title?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
