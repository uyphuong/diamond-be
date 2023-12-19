import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email!: string;

  @IsOptional()
  @IsNumber()
  totalPrice!: number;

  @IsOptional()
  @IsString()
  note!: string;
}
