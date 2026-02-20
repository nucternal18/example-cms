import { IsString, IsEnum, IsOptional } from 'class-validator';
import { FeedbackType } from '@prisma/client';

export class CreateFeedbackDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;
}
