import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateActionDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  method: string;

  @IsString()
  route: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
