import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionDto } from './create-institution.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
  @IsOptional()
  @IsNumber()
  instituteUpdatedById?: number;
}
