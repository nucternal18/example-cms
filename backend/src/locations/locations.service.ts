import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  async findAll(): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: {
        parentId: null, // Get root locations
      },
      include: {
        children: {
          include: {
            children: true, // Include nested children
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    try {
      return await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
      });
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.location.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
