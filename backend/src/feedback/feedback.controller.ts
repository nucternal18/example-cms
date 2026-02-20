import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { RespondFeedbackDto } from './dto/respond-feedback.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FeedbackStatus } from '@prisma/client';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    // Public endpoint for mobile app
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @UseGuards(ClerkAuthGuard)
  findAll(
    @Query('status') status?: FeedbackStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.feedbackService.findAll(status, page, limit);
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Patch(':id/status')
  @UseGuards(ClerkAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/respond')
  @UseGuards(ClerkAuthGuard)
  respond(
    @Param('id') id: string,
    @Body() respondDto: RespondFeedbackDto,
    @CurrentUser() user: any,
  ) {
    // TODO: Get user ID from database using clerkId
    return this.feedbackService.respond(id, respondDto, user.clerkId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
