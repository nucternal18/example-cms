import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { type Page, PageStatus, Prisma } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto, authorId: string): Promise<Page> {
    // Check if slug already exists
    const existingPage = (await this.prisma.page.findUnique({
      where: { slug: createPageDto.slug },
    })) as Page | null;

    if (existingPage) {
      throw new ConflictException(`Page with slug "${createPageDto.slug}" already exists`);
    }

    const { publishedAt, scheduledAt, ...data } = createPageDto;

    return this.prisma.page.create({
      data: {
        ...data,
        authorId,
        blocks: createPageDto.blocks as Prisma.JsonValue, // Prisma Json type
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: data.status || PageStatus.DRAFT,
      },
    });
  }

  async findAll(
    status?: PageStatus,
    page = 1,
    limit = 10,
  ): Promise<{ data: Page[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
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
      this.prisma.page.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
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

    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    return page;
  }

  async findBySlug(slug: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
      where: { slug },
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

    if (!page) {
      throw new NotFoundException(`Page with slug "${slug}" not found`);
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const { publishedAt, scheduledAt, slug, ...data } = updatePageDto;
    const updateData: any = { ...data };

    // Check slug uniqueness if slug is being updated
    if (slug) {
      const existingPage = await this.prisma.page.findUnique({
        where: { slug },
      });

      if (existingPage && existingPage.id !== id) {
        throw new ConflictException(`Page with slug "${slug}" already exists`);
      }
      updateData.slug = slug;
    }

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (scheduledAt !== undefined) {
      updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    }

    if (updatePageDto.blocks) {
      updateData.blocks = updatePageDto.blocks as any;
    }

    try {
      return await this.prisma.page.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.page.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
  }

  async getPublishedPages(): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: {
        status: PageStatus.PUBLISHED,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: new Date() } },
        ],
      },
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
        publishedAt: 'desc',
      },
    });
  }
}
