import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  userType: string

  @IsString()
  mappedId: string;

  @IsOptional()
  password?: string;
}
