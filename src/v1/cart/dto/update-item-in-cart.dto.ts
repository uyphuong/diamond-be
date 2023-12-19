import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { ItemDTO } from './item.dto';

export class UpdateItemInCartDTO {
  @IsNotEmpty()
  @IsArray()
  @Type(() => ItemDTO)
  @ValidateNested({ each: true })
  item!: ItemDTO[];
}
