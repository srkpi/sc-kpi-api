import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FaqCategoryService } from './category.service';
import { plainToInstance } from 'class-transformer';
import { ReadCategoryDto } from './dto/read-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryIdDto } from './dto/category-id.dto';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';

@Roles(Role.Admin)
@ApiTags('faq')
@Controller('faq/categories')
export class FaqCategoryController {
  constructor(private categoryService: FaqCategoryService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const res = await this.categoryService.create(dto);
    return plainToInstance(ReadCategoryDto, res);
  }

  @Public()
  @Get()
  async getAll() {
    const res = await this.categoryService.getAll();
    return plainToInstance(ReadCategoryDto, res);
  }

  @Put()
  async update(@Body() dto: UpdateCategoryDto) {
    const res = await this.categoryService.update(dto);
    return plainToInstance(ReadCategoryDto, res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() dto: CategoryIdDto) {
    await this.categoryService.remove(dto.id);
  }
}
