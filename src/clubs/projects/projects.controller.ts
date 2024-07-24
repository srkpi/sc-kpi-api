import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectIdDto } from './dto/project-id.dto';
import { ReadProjectDto } from './dto/read-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { Role } from 'src/auth/types';
import { Roles } from 'src/auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import convert from 'convert';
import { validateOrReject } from 'class-validator';

@ApiTags('clubs')
@Roles(Role.Admin)
@Controller('clubs/projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, type: ReadProjectDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: convert(25, 'MiB').to('B') }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('json') createProjectDtoString: string,
  ): Promise<ReadProjectDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');

    let createProjectDto: CreateProjectDto;
    try {
      createProjectDto = JSON.parse(createProjectDtoString);
    } catch (error) {
      this.logger.error('Invalid json');
      throw new BadRequestException('Bad request body');
    }

    try {
      await validateOrReject(
        plainToInstance(CreateProjectDto, createProjectDto),
      );
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const res = await this.projectsService.create(createProjectDto, image);
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
