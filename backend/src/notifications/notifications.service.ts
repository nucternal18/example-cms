import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    createdById: string,
  ): Promise<Notification> {
    const { scheduledAt, ...data } = createNotificationDto;
    return this.prisma.notification.create({
      data: {
        ...data,
        createdById,
        locationIds: data.locationIds || [],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: NotificationStatus.PENDING,
      },
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      include: {
        createdBy: {
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
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const { scheduledAt, ...data } = updateNotificationDto;
    const updateData: any = { ...data };
    
    if (scheduledAt !== undefined) {
      updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    }

    try {
      return await this.prisma.notification.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async send(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    
    // TODO: Implement actual push notification sending logic
    
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
    });
  }
}
