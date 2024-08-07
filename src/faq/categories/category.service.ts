import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class FaqCategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prismaService.faqCategory.create({
      data: dto,
    });
  }

  async getAll() {
    return this.prismaService.faqCategory.findMany();
  }

  async update(dto: UpdateCategoryDto) {
    try {
      return this.prismaService.faqCategory.update({
        where: { id: dto.id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException('Category with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      return this.prismaService.faqCategory.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Category with this ID does not exist');
    }
  }
}
