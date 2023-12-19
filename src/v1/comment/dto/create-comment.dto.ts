import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsMongoId()
  product: string;
}
