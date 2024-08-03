import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prismaService: PrismaService) {}

  async create(createFaqDto: CreateFaqDto) {
    const { categoryId, ...faqDto } = createFaqDto;
    const category = await this.prismaService.faqCategory.findFirst({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return await this.prismaService.faq.create({
      data: { ...faqDto, category: { connect: { id: categoryId } } },
      include: { category: true },
    });
  }

  async findAll() {
    return await this.prismaService.faq.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const faq = await this.prismaService.faq.findFirst({
      where: { id },
      include: { category: true },
    });
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  async update(updateFaqDto: UpdateFaqDto) {
    try {
      const { id, categoryId, ...data } = updateFaqDto;
      return await this.prismaService.faq.update({
        where: { id },
        data: {
          ...data,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
        },
        include: { category: true },
      });
    } catch {
      throw new NotFoundException('FAQ with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.faq.delete({
        where: { id },
        include: { category: true },
      });
    } catch {
      throw new NotFoundException('FAQ with this ID does not exist');
    }
  }
}
