import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  body: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
