import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ImgurService } from '../../imgur/imgur.service';
import { DepartmentProject } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private prismaService: PrismaService,
    private readonly imgurService: ImgurService,
  ) {}

  async create(createProjectDto: CreateProjectDto, image: string) {
    const { name, description } = createProjectDto;
    const imageData = await this.imgurService.uploadImage(
      image,
      name,
      description,
    );
    return this.prismaService.departmentProject.create({
      data: {
        ...createProjectDto,
        image: imageData.url,
        imageDeleteHash: imageData.deleteHash,
      },
    });
  }

  async findAll(departmentId: number) {
    return this.prismaService.departmentProject.findMany({
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
      return await this.prismaService.departmentProject.update({
        where: { id: updateProjectDto.id },
        data: updateProjectDto,
      });
    } catch {
      throw new NotFoundException('Project with this ID does not exist');
    }
  }

  async updateImage(newImage: string, id: number) {
    const project = await this.prismaService.departmentProject.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project with this ID does not exist');
    }
    await this.imgurService.deleteImage(project.imageDeleteHash);
    const imageData = await this.imgurService.uploadImage(
      newImage,
      project.name,
      project.description,
    );
    const data = {
      image: imageData.url,
      imageDeleteHash: imageData.deleteHash,
    };
    return this.prismaService.departmentProject.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    let removedProject: DepartmentProject;
    try {
      removedProject = await this.prismaService.departmentProject.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Project with this ID does not exist');
    }
    await this.imgurService.deleteImage(removedProject.imageDeleteHash);
  }
}
