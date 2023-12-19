import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpsertProductWarehouseDTO {
  @IsNotEmpty()
  @IsMongoId()
  warehouse: string;

  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
