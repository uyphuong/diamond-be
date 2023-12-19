import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ItemDTO } from './item.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';

export class UpdateOrderDTO {
  @IsOptional()
  @IsArray()
  @Type(() => ItemDTO)
  @ValidateNested({ each: true })
  item!: ItemDTO[];

  @IsOptional()
  @IsString()
  @IsEnum(OrderStatusEnum)
  status!: string;
}
