import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImgurService } from '../imgur/imgur.service';

@Injectable()
export class DepartmentsService {
  constructor(
    private prismaService: PrismaService,
    private readonly imgurService: ImgurService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, image: string) {
    const { name, shortDescription } = createDepartmentDto;
    const imageData = await this.imgurService.uploadImage(
      image,
      name,
      shortDescription,
    );
    return this.prismaService.department.create({
      data: {
        ...createDepartmentDto,
        image: imageData.url,
        imageDeleteHash: imageData.deleteHash,
      },
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

  async updateImage(newImage: string, id: number) {
    const department = await this.prismaService.department.findUnique({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Department with this ID does not exist');
    }
    await this.imgurService.deleteImage(department.imageDeleteHash);
    const imageData = await this.imgurService.uploadImage(
      newImage,
      department.name,
      department.shortDescription,
    );
    const data = {
      image: imageData.url,
      imageDeleteHash: imageData.deleteHash,
    };
    return this.prismaService.department.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      const removedDepartment = await this.prismaService.department.delete({
        where: { id },
      });
      await this.imgurService.deleteImage(removedDepartment.imageDeleteHash);
    } catch {
      throw new NotFoundException('Department with this ID does not exist');
    }
  }
}
