import { IsString, IsDateString } from 'class-validator';

export class AssignLicenseDto {
  @IsString()
  customerId: string;    
  @IsString()
  institutionId: string;   
  @IsString()
  packageId: string;       
  @IsDateString()
  validFrom: string;    

  @IsDateString()
  validTill: string;    
}
