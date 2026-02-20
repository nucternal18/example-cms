import { IsString } from 'class-validator';

export class RespondFeedbackDto {
  @IsString()
  message: string;
}
