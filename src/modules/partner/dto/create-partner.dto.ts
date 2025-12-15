import { IsEmail, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  companyName: string;

  @IsString()
  contactPerson: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
