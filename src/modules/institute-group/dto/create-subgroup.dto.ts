import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubGroupDto {
  @IsUUID()
  groupId: string;

  @IsNotEmpty()
  subGroupName: string;
}
