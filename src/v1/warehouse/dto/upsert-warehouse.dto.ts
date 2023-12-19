import { IsOptional, IsString } from 'class-validator';

export class UpsertWarehouseDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  address: string;
}
