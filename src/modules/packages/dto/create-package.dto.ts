import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsArray()
  modules: {
    moduleId: string;
    fullModule: boolean;
    actions: string[];  
  }[];

  @IsOptional()
  @IsArray()
  addons: string[]; 
}
