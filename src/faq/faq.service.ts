import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prismaService: PrismaService) {}

  async create(createFaqDto: CreateFaqDto) {
    return await this.prismaService.faq.create({
      data: { ...createFaqDto },
    });
  }

  async findAll() {
    return await this.prismaService.faq.findMany();
  }

  async findOne(id: number) {
    const faq = await this.prismaService.faq.findFirst({ where: { id } });
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  async update(updateFaqDto: UpdateFaqDto) {
    try {
      return await this.prismaService.faq.update({
        where: { id: updateFaqDto.id },
        data: { ...updateFaqDto },
      });
    } catch {
      throw new NotFoundException('FAQ with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.faq.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('FAQ with this ID does not exist');
    }
  }
}
