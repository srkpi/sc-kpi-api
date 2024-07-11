import {
  Body,
  Controller,
  Delete,
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
import { Role } from 'src/auth/types';
import { Roles } from 'src/auth/decorators';

@ApiTags('clubs')
@Roles(Role.Admin)
@Controller('clubs/projects')
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

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Project with this ID does not exist',
  })
  async remove(@Param() dto: ProjectIdDto): Promise<void> {
    await this.projectsService.remove(dto.projectId);
  }
}
