import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    location: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create location', async () => {
      const createLocationDto = {
        name: 'Test Location',
        description: 'Test Description',
      };
      const expectedLocation = {
        id: 'location-id',
        ...createLocationDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.location.create.mockResolvedValue(expectedLocation);

      const result = await service.create(createLocationDto);

      expect(result).toEqual(expectedLocation);
      expect(mockPrismaService.location.create).toHaveBeenCalledWith({
        data: createLocationDto,
      });
    });
  });

  describe('findOne', () => {
    it('should return location if found', async () => {
      const locationId = 'location-id';
      const expectedLocation = {
        id: locationId,
        name: 'Test Location',
      };

      mockPrismaService.location.findUnique.mockResolvedValue(expectedLocation);

      const result = await service.findOne(locationId);

      expect(result).toEqual(expectedLocation);
    });

    it('should throw NotFoundException if location not found', async () => {
      const locationId = 'non-existent-id';

      mockPrismaService.location.findUnique.mockResolvedValue(null);

      await expect(service.findOne(locationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
