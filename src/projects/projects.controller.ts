import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectIdDto } from './dto/project-id.dto';
import { ReadProjectDto } from './dto/read-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiResponse({ status: 201, type: ReadProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ReadProjectDto> {
    const res = await this.projectsService.create(createProjectDto);
    return plainToInstance(ReadProjectDto, res);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ReadProjectDto] })
  async findAll(): Promise<ReadProjectDto[]> {
    const res = await this.projectsService.findAll();
    return plainToInstance(ReadProjectDto, res);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param() dto: ProjectIdDto): Promise<ReadProjectDto> {
    const res = await this.projectsService.findOne(dto.id);
    return plainToInstance(ReadProjectDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Project with this ID does not exist',
  })
  async update(
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ReadProjectDto> {
    const res = await this.projectsService.update(updateProjectDto);
    return plainToInstance(ReadProjectDto, res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Project with this ID does not exist',
  })
  async remove(@Param() dto: ProjectIdDto): Promise<void> {
    await this.projectsService.remove(dto.id);
  }
}
