import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ContentService', () => {
  let service: ContentService;
  let prisma: PrismaService;

  const mockPrismaService = {
    content: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create content', async () => {
      const createContentDto = {
        type: 'ARTICLE' as const,
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        status: 'DRAFT' as const,
      };
      const authorId = 'author-id';
      const expectedContent = {
        id: 'content-id',
        ...createContentDto,
        authorId,
        locationIds: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.content.create.mockResolvedValue(expectedContent);

      const result = await service.create(createContentDto, authorId);

      expect(result).toEqual(expectedContent);
      expect(mockPrismaService.content.create).toHaveBeenCalledWith({
        data: {
          ...createContentDto,
          authorId,
          locationIds: [],
          publishedAt: null,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return content if found', async () => {
      const contentId = 'content-id';
      const expectedContent = {
        id: contentId,
        type: 'ARTICLE' as const,
        title: 'Test Article',
      };

      mockPrismaService.content.findUnique.mockResolvedValue(expectedContent);

      const result = await service.findOne(contentId);

      expect(result).toEqual(expectedContent);
    });

    it('should throw NotFoundException if content not found', async () => {
      const contentId = 'non-existent-id';

      mockPrismaService.content.findUnique.mockResolvedValue(null);

      await expect(service.findOne(contentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
