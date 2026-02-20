import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { RespondFeedbackDto } from './dto/respond-feedback.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { Feedback, FeedbackStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.prisma.feedback.create({
      data: {
        ...createFeedbackDto,
        status: FeedbackStatus.OPEN,
      },
    });
  }

  async findAll(
    status?: FeedbackStatus,
    page = 1,
    limit = 10,
  ): Promise<{ data: Feedback[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        include: {
          responses: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        responses: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    try {
      return await this.prisma.feedback.update({
        where: { id },
        data: updateFeedbackDto,
      });
    } catch (error) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateFeedbackStatusDto,
  ): Promise<Feedback> {
    try {
      return await this.prisma.feedback.update({
        where: { id },
        data: {
          status: updateStatusDto.status,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
  }

  async respond(
    id: string,
    respondDto: RespondFeedbackDto,
    authorId: string,
  ): Promise<Feedback> {
    const feedback = await this.findOne(id);

    await this.prisma.feedbackResponse.create({
      data: {
        feedbackId: id,
        message: respondDto.message,
        authorId,
      },
    });

    // Update status to IN_PROGRESS if it was OPEN
    if (feedback.status === FeedbackStatus.OPEN) {
      await this.updateStatus(id, { status: FeedbackStatus.IN_PROGRESS });
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.feedback.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
  }
}
