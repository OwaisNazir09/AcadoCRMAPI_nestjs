import { IsUUID } from 'class-validator';

export class AddInstituteDto {
  @IsUUID()
  groupId: string;

  @IsUUID()
  instituteId: string;
}
