import { IsString, IsOptional } from 'class-validator';

export class RevokeLicenseDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;
}