import { IsArray, IsString } from 'class-validator';

export class AssignRoutesDto {
  @IsString()
  roleId: string;

  @IsArray()
  routeIds: string[];
}