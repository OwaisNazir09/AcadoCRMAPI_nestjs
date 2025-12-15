import { IsOptional, IsString } from 'class-validator';

export class UpdateVersionDto {
  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
