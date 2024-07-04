import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadDepartmentDto } from './dto/read-department.dto';
import { plainToInstance } from 'class-transformer';
import { DepartmentIdDto } from './dto/department-id.dto';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiResponse({ status: 201, type: ReadDepartmentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<ReadDepartmentDto> {
    const res = await this.departmentsService.create(createDepartmentDto);
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ReadDepartmentDto] })
  async findAll(): Promise<ReadDepartmentDto[]> {
    const res = await this.departmentsService.findAll();
    return plainToInstance(ReadDepartmentDto, res);
  }

  @Get(':departmentId')
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
