import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImgurService } from '../imgur/imgur.service';

@Injectable()
export class ServicesService {
  constructor(
    private prismaService: PrismaService,
    private readonly imgurService: ImgurService,
  ) {}

  async create(createServiceDto: CreateServiceDto, image: string) {
    const { name, description } = createServiceDto;
    const imageData = await this.imgurService.uploadImage(
      image,
      name,
      description,
    );
    return this.prismaService.service.create({
      data: {
        ...createServiceDto,
        image: imageData.url,
        imageDeleteHash: imageData.deleteHash,
      },
    });
  }

  async findAll() {
    return this.prismaService.service.findMany();
  }

  async findOne(id: number) {
    const service = await this.prismaService.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service with this ID does not exist');
    }
    return service;
  }

  async update(updateServiceDto: UpdateServiceDto) {
    try {
      const { id, ...data } = updateServiceDto;
      return await this.prismaService.service.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Service with this ID does not exist');
    }
  }

  async updateImage(newImage: string, id: number) {
    const service = await this.prismaService.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service with this ID does not exist');
    }
    await this.imgurService.deleteImage(service.imageDeleteHash);
    const imageData = await this.imgurService.uploadImage(
      newImage,
      service.name,
      service.description,
    );
    const data = {
      image: imageData.url,
      imageDeleteHash: imageData.deleteHash,
    };
    return this.prismaService.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      const removedService = await this.prismaService.service.delete({
        where: { id },
      });
      await this.imgurService.deleteImage(removedService.imageDeleteHash);
    } catch {
      throw new NotFoundException('Service with this ID does not exist');
    }
  }
}
