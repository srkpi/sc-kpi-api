import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prismaService: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { projects, ...data } = createDepartmentDto;
    return this.prismaService.department.create({
      data: {
        ...data,
        projects: { createMany: { data: projects ?? [] } },
      },
      include: { projects: true },
    });
  }

  async findAll() {
    return this.prismaService.department.findMany({
      include: { projects: true },
    });
  }

  async findOne(id: number) {
    const department = await this.prismaService.department.findUnique({
      where: { id },
      include: { projects: true },
    });
    if (!department) {
      throw new NotFoundException('Department with this ID does not exist');
    }
    return department;
  }

  async update(updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const { id, ...data } = updateDepartmentDto;
      return await this.prismaService.department.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Department with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.department.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Department with this ID does not exist');
    }
  }
}
