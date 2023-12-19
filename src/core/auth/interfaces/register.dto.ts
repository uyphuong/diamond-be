import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { NoWhitespace } from 'src/utils/NoWhiteScape.decorator';
import { RoleUserEnum } from './role.enum';

export class RegisterDTO {
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

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  fullName: string;

  @IsNotEmpty()
  @IsEnum(RoleUserEnum)
  role?: string;

  @IsOptional()
  @IsString()
  email: string;
}
