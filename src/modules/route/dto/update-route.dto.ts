import { IsOptional, IsString } from 'class-validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  path?: string;
}
