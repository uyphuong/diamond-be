import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertPromotionDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  discount: number;
}
