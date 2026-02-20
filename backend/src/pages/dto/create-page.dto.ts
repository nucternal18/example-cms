import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageStatus } from '@prisma/client';

export class PageBlockDto {
  @IsString()
  type: string; // e.g., 'text', 'image', 'video', 'heading', 'quote', etc.

  @IsObject()
  data: Record<string, any>; // Flexible data structure for each block type

  @IsOptional()
  @IsString()
  id?: string; // Optional block ID for ordering/editing
}

export class CreatePageDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageBlockDto)
  blocks: PageBlockDto[];

  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}
