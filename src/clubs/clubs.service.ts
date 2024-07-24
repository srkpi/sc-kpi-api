import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async create(createClubDto: CreateClubDto) {
    return this.prisma.club.create({
      data: {
        name: createClubDto.name,
        description: createClubDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.club.findMany({
      include: { projects: true },
    });
  }

  async findOne(id: number) {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: { projects: true },
    });
    if (!club) {
      throw new NotFoundException('Club with this ID does not exist');
    }
    return club;
  }

  async update(updateClubDto: UpdateClubDto) {
    try {
      return await this.prisma.club.update({
        where: { id: updateClubDto.id },
        data: {
          name: updateClubDto.name,
          description: updateClubDto.description,
        },
        include: { projects: true },
      });
    } catch {
      throw new NotFoundException('Club with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.club.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Club with this ID does not exist');
    }
  }
}
