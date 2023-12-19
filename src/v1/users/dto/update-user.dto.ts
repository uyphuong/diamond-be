import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { NoWhitespace } from 'src/utils/NoWhiteScape.decorator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(5)
  @NoWhitespace()
  password: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  fullName: string;

  @IsOptional()
  @IsString()
  email: string;
}
