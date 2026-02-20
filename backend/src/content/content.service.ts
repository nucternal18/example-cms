import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentType, ContentStatus } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto, authorId: string): Promise<Content> {
    const { locationIds, ...data } = createContentDto;
    return this.prisma.content.create({
      data: {
        ...data,
        authorId,
        locationIds: locationIds || [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });
  }

  async findAll(
    type?: ContentType,
    status?: ContentStatus,
    page = 1,
    limit = 10,
  ): Promise<{ data: Content[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: limit,
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
          createdAt: 'desc',
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const { locationIds, publishedAt, ...data } = updateContentDto;
    const updateData: any = { ...data };
    
    if (locationIds !== undefined) {
      updateData.locationIds = locationIds;
    }
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    try {
      return await this.prisma.content.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.content.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }
}
