import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsOptional()
  @IsString()
  content: string;
}
