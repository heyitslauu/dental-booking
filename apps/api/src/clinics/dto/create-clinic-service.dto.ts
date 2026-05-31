import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateClinicServiceDto {
  @IsString()
  clinicId: string;

  @IsString()
  serviceId: string;

  @IsInt()
  @Min(0)
  priceCents: number;

  @IsInt()
  @IsPositive()
  durationMinutes: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
