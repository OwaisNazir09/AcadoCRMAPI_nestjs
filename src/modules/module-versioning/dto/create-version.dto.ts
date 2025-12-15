import {
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActionChangeDto {
  @IsOptional()
  @IsString()
  actionId?: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  method: string;

  @IsString()
  route: string;

  @IsBoolean()
  isActive: boolean;

  @IsIn(['added', 'updated', 'unchanged'])
  changeType: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateModuleChangeDto {
  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  routeBase: string;

  @IsBoolean()
  isActive: boolean;

  @IsIn(['added', 'updated', 'unchanged'])
  changeType: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateActionChangeDto)
  actions: CreateActionChangeDto[];
}

export class CreateVersionDto {
  @IsString()
  version: string;

  @IsString()
  releasedBy: string;

  @IsDateString()
  releasedAt: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleChangeDto)
  modules: CreateModuleChangeDto[];
}
