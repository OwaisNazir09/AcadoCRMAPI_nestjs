import { IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  groupId: string;

  @IsString()
  name: string;

  @IsString()
  path: string;
}
