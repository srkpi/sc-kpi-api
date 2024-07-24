import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentIdDto } from './dto/department-id.dto';
import { ReadDepartmentDto } from './dto/read-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';
import { FileInterceptor } from '@nestjs/platform-express';
import convert from 'convert';
import { validateOrReject } from 'class-validator';

@ApiTags('departments')
@Roles(Role.Admin)
@Controller('departments')
export class DepartmentsController {
  private readonly logger = new Logger(DepartmentsController.name);

  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({ status: 201, type: ReadDepartmentDto })
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
    @Body('json') createDepartmentDtoString: string,
  ): Promise<ReadDepartmentDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');

    let createDepartmentDto: CreateDepartmentDto;
    try {
      createDepartmentDto = JSON.parse(createDepartmentDtoString);
    } catch (error) {
      this.logger.error('Invalid json');
      throw new BadRequestException('Bad request body');
    }

    try {
      await validateOrReject(
        plainToInstance(CreateDepartmentDto, createDepartmentDto),
      );
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const res = await this.departmentsService.create(
      createDepartmentDto,
      image,
    );
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: [ReadDepartmentDto] })
  async findAll(): Promise<ReadDepartmentDto[]> {
    const res = await this.departmentsService.findAll();
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Get(':departmentId')
  @Public()
  @ApiResponse({ status: 200, type: ReadDepartmentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findOne(@Param() dto: DepartmentIdDto): Promise<ReadDepartmentDto> {
    const res = await this.departmentsService.findOne(dto.departmentId);
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadDepartmentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Department with this ID does not exist',
  })
  async update(
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ReadDepartmentDto> {
    const res = await this.departmentsService.update(updateDepartmentDto);
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Delete(':departmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Department deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Department with this ID does not exist',
  })
  async remove(@Param() dto: DepartmentIdDto): Promise<void> {
    await this.departmentsService.remove(dto.departmentId);
  }
}
