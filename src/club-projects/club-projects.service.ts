import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClubProjectDto } from './dto/create-club-project.dto';
import { UpdateClubProjectDto } from './dto/update-club-project.dto';

@Injectable()
export class ClubProjectsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProjectDto: CreateClubProjectDto) {
    const createdProject = await this.prismaService.clubProject.create({
      data: createProjectDto,
    });
    return createdProject;
  }

  async findAll() {
    return await this.prismaService.clubProject.findMany();
  }

  async findOne(id: number) {
    const project = await this.prismaService.clubProject.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(updateProjectDto: UpdateClubProjectDto) {
    try {
      const updatedProject = await this.prismaService.clubProject.update({
        where: { id: updateProjectDto.id },
        data: updateProjectDto,
      });
      return updatedProject;
    } catch {
      throw new NotFoundException('Project with this ID does not exist');
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.clubProject.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Project with this ID does not exist');
    }
  }
}
