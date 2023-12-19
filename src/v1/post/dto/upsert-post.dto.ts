import { IsOptional, IsString } from 'class-validator';

export class UpsertPostDTO {
  @IsString()
  @IsOptional()
  content: string;
}
