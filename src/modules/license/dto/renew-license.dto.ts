import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class RenewLicenseDto {
  @IsNumber()
  @Min(1)
  extensionDays: number;

  @IsOptional()
  @IsString()
  notes?: string;
}