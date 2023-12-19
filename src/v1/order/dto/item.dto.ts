import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class ItemDTO {
  @IsOptional()
  @IsMongoId()
  readonly product?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly quantity!: number;
}
