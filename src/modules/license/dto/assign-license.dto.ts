import { IsString } from 'class-validator';

export class AssignLicenseDto {
  @IsString()
  institutionId: string;

  @IsString()
  institutionName: string;
}