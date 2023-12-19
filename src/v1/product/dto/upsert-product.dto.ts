import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertProductDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  image: [string];

  @IsOptional()
  @IsBoolean()
  isTrending: boolean;

  @IsOptional()
  @IsString()
  material: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsNumber()
  promotion: number;

  @IsOptional()
  @IsMongoId()
  subCategory: string;
}
