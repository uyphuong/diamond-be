import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class UpsertRatingDTO {
  @IsOptional()
  @IsMongoId()
  product: string;

  @IsOptional()
  @IsNumber()
  rate: number;
}
