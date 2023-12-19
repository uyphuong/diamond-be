import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { NoWhitespace } from 'src/utils/NoWhiteScape.decorator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(5, 26)
  @IsLowercase()
  @NoWhitespace()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(5)
  @NoWhitespace()
  password: string;
}
