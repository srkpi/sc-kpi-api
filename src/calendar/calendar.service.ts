import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prismaService: PrismaService) {}

  async getAllEvents() {
    return this.prismaService.calendarEvent.findMany();
  }

  async getEvent(id: number) {
    const event = await this.prismaService.calendarEvent.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('Club with this ID does not exist');
    }
    return event;
  }

  async createEvent(dto: CreateCalendarEventDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be later than end date');
    }

    return this.prismaService.calendarEvent.create({ data: dto });
  }

  async updateEvent(dto: UpdateCalendarEventDto) {
    const event = await this.prismaService.calendarEvent.findUnique({
      where: { id: dto.id },
    });
    if (!event) {
      throw new NotFoundException('Event with this ID does not exist');
    }

    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(event.startDate);
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(event.endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be later than end date');
    }

    const { id, ...data } = dto;
    return this.prismaService.calendarEvent.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteEvent(id: number) {
    try {
      await this.prismaService.calendarEvent.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Event with this ID does not exist');
    }
  }
}
