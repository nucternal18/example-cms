import { IsString, IsEnum, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ContentType, ContentStatus } from '@prisma/client';

export class CreateContentDto {
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locationIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
