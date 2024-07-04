import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const createdProject = await this.prismaService.departmentProject.create({
      data: createProjectDto,
    });
    return createdProject;
  }

  async findAll(departmentId: number) {
    return await this.prismaService.departmentProject.findMany({
      where: { departmentId },
    });
  }

  async findOne(id: number) {
    const project = await this.prismaService.departmentProject.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await this.prismaService.departmentProject.update({
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
      await this.prismaService.departmentProject.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Project with this ID does not exist');
    }
  }
}
