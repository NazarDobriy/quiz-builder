import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { QuestionType } from '../models/question.model';

export class CreateOptionDto {
  @IsString() @IsNotEmpty() @MaxLength(500)
  text!: string;

  @IsBoolean()
  isCorrect!: boolean;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsString() @IsNotEmpty() @MaxLength(1000)
  text!: string;

  @IsOptional() @IsString()
  correctAnswer?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString() @IsNotEmpty() @MaxLength(200)
  title!: string;

  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[];
}
