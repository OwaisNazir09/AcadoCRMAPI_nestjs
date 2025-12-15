import { IsEmail, IsString } from 'class-validator';

export class CreateInstituteAdminDto {
  @IsString()
  instituteId: string;

  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
