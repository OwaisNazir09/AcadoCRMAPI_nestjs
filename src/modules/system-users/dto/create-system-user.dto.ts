import { IsEmail, isString, IsString } from 'class-validator';

export class CreateSystemUserDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  roleId: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  userType:string
}
