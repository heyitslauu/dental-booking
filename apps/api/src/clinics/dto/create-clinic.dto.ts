import { IsOptional, IsString } from "class-validator";

export class CreateClinicDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
