import { IsString, IsEnum, IsOptional, IsArray, IsDateString } from 'class-validator';
import { NotificationType, NotificationTarget } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationTarget)
  @IsOptional()
  targetType?: NotificationTarget;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locationIds?: string[];

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}
