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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentIdDto } from './dto/department-id.dto';
import { ReadDepartmentDto } from './dto/read-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';

@ApiTags('departments')
@Roles(Role.Admin)
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
