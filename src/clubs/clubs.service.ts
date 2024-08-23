import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ImgurService } from 'src/imgur/imgur.service';

@Injectable()
export class ClubsService {
  constructor(
    private prismaService: PrismaService,
    private readonly imgurService: ImgurService,
  ) {}

  async create(createClubDto: CreateClubDto, image: string) {
    const { name, shortDescription } = createClubDto;
    const imageData = await this.imgurService.uploadImage(
      image,
      name,
      shortDescription,
    );
    return this.prismaService.club.create({
      data: {
        ...createClubDto,
        image: imageData.url,
        imageDeleteHash: imageData.deleteHash,
      },
    });
  }

  async findAll() {
    return this.prismaService.club.findMany({
      include: { projects: true },
    });
  }

  async findOne(id: number) {
    const club = await this.prismaService.club.findUnique({
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
      const { id, ...data } = updateClubDto;
      return await this.prismaService.club.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Club with this ID does not exist');
    }
  }

  async updateImage(newImage: string, id: number) {
    const club = await this.prismaService.club.findUnique({
      where: { id },
    });
    if (!club) {
      throw new NotFoundException('Club with this ID does not exist');
    }
    await this.imgurService.deleteImage(club.imageDeleteHash);
    const imageData = await this.imgurService.uploadImage(
      newImage,
      club.name,
      club.shortDescription,
    );
    const data = {
      image: imageData.url,
      imageDeleteHash: imageData.deleteHash,
    };
    return this.prismaService.club.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      const removedClub = await this.prismaService.club.delete({
        where: { id },
      });
      await this.imgurService.deleteImage(removedClub.imageDeleteHash);
    } catch {
      throw new NotFoundException('Club with this ID does not exist');
    }
  }
}
