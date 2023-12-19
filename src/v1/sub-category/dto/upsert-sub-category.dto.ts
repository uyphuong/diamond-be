import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpsertSubCategoryDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsMongoId()
  category: string;
}
