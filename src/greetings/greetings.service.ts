import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GreetingIdDto } from './dto/greeting-id.dto';
import { UpdateGreetingDto } from './dto/update-greeting.dto';

@Injectable()
export class GreetingsService {
  constructor(private prisma: PrismaService) {}

  async createGreeting(dto: CreateGreetingDto) {
    return this.prisma.greeting.create({
      data: {
        ...dto,
      },
    });
  }

  async getGreetingInfo(dto: GreetingIdDto) {
    const greetingInfo = await this.prisma.greeting.findFirst({
      where: { id: dto.id },
    });
    if (!greetingInfo) {
      throw new NotFoundException('greeting not found');
    }
    return greetingInfo;
  }

  async getAllGreetings() {
    return this.prisma.greeting.findMany();
  }

  async getGreeting(dto: GreetingIdDto) {
    const greetingInfo = await this.prisma.greeting.findFirst({
      where: { id: dto.id },
    });
    if (!greetingInfo) {
      throw new NotFoundException('greeting not found');
    }

    const { greeting, name } = greetingInfo;
    return greeting + ', ' + name + '!';
  }

  async updateGreeting(dto: UpdateGreetingDto) {
    const { id, ...data } = dto;
    return this.prisma.greeting.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteGreeting(dto: GreetingIdDto) {
    try {
      await this.prisma.greeting.delete({ where: { id: dto.id } });
    } catch (e) {
      return {
        message: 'greeting with this id does not exist',
      };
    }
    return {
      message: 'greeting is successfully deleted',
    };
  }
}
