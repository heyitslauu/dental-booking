import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  clinicId: string;

  @IsString()
  serviceId: string;

  @IsString()
  patientId: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
