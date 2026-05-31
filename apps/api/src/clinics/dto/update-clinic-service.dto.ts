import { IsBoolean, IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class UpdateClinicServiceDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  priceCents?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
