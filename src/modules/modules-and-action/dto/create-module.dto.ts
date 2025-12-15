import { IsString, IsBoolean } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  routeBase: string;

  @IsBoolean()
  isActive: boolean;
}
