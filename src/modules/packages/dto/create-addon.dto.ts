import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;
}
