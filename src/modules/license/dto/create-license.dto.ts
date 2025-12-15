import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateLicenseDto {
  @IsString()
  packageId: string;

  @IsString()
  customerId: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  institutionId?: string;

  @IsOptional()
  @IsString()
  institutionName?: string;

  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsers?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}