import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsString()
  mappedId?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  isActive?: boolean;
}
