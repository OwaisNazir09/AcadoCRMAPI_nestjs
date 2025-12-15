import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateInstitutionDto {
  // Basic Details
  @IsOptional()
  @IsString()
  institutePrefix?: string;

  @IsString()
  instituteName: string;

  @IsOptional()
  @IsString()
  instituteAddress?: string;

  @IsOptional()
  @IsString()
  instituteAbout?: string;

  @IsOptional()
  @IsString()
  instituteContactNumber?: string;

  @IsOptional()
  @IsEmail()
  instituteEmail?: string;

  @IsOptional()
  @IsString()
  instituteWebsite?: string;

  @IsOptional()
  @IsString()
  instituteDomain?: string;

  // Primary Contact Person
  @IsOptional()
  @IsString()
  primaryContactPerson?: string;

  @IsOptional()
  @IsString()
  primaryContactDesignation?: string;

  @IsOptional()
  @IsString()
  primaryContactPhone?: string;

  @IsOptional()
  @IsEmail()
  primaryContactEmail?: string;

  // Support Team
  @IsOptional()
  @IsString()
  supportContactPerson?: string;

  @IsOptional()
  @IsString()
  supportContactDesignation?: string; // NEW FIELD

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportWhatsappNumber?: string;

  // Institute Type / Group
  @IsOptional()
  @IsString()
  instituteType?: string;

  @IsOptional()
  @IsUUID()
  instituteGroupId?: string;

  @IsOptional()
  @IsUUID()
  instituteSubGroupId?: string;

    @IsOptional()
    @IsUUID()
    instituteUserId?: string;

  @IsOptional()
  @IsUUID()
  instituteCreatedById?: string;
}
