import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateStaffProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
