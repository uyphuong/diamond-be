import { IsOptional, IsString } from 'class-validator';

export class UpsertCategoryDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type: string;
}
