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
import { CreateClubProjectDto } from './dto/create-club-project.dto';
import { ClubProjectIdDto } from './dto/club-project-id.dto';
import { ReadClubProjectDto } from './dto/read-club-project.dto';
import { UpdateClubProjectDto } from './dto/update-club-project.dto';
import { ClubProjectsService } from './club-projects.service';

@ApiTags('club-projects')
@Controller('club-projects')
export class ClubProjectsController {
  constructor(private readonly projectsService: ClubProjectsService) {}

  @Post()
  @ApiResponse({ status: 201, type: ReadClubProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createProjectDto: CreateClubProjectDto,
  ): Promise<ReadClubProjectDto> {
    const res = await this.projectsService.create(createProjectDto);
    return plainToInstance(ReadClubProjectDto, res);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ReadClubProjectDto] })
  async findAll(): Promise<ReadClubProjectDto[]> {
    const res = await this.projectsService.findAll();
    return plainToInstance(ReadClubProjectDto, res);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ReadClubProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param() dto: ClubProjectIdDto): Promise<ReadClubProjectDto> {
    const res = await this.projectsService.findOne(dto.id);
    return plainToInstance(ReadClubProjectDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadClubProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Project with this ID does not exist',
  })
  async update(
    @Body() updateProjectDto: UpdateClubProjectDto,
  ): Promise<ReadClubProjectDto> {
    const res = await this.projectsService.update(updateProjectDto);
    return plainToInstance(ReadClubProjectDto, res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Project with this ID does not exist',
  })
  async remove(@Param() dto: ClubProjectIdDto): Promise<void> {
    await this.projectsService.remove(dto.id);
  }
}
