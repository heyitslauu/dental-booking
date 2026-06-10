import { Type } from "class-transformer";
import { UserRole } from "@prisma/client";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ClinicAccessInputDto } from "./clinic-access-input.dto";

export class CreateAdminUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClinicAccessInputDto)
  clinicAccess?: ClinicAccessInputDto[];
}
