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
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqIdDto } from './dto/faq-id.dto';
import { ReadFaqDto } from './dto/read-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';

@ApiTags('faq')
@Roles(Role.Admin)
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiResponse({ status: 201, type: ReadFaqDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createFaqDto: CreateFaqDto): Promise<ReadFaqDto> {
    const res = await this.faqService.create(createFaqDto);
    return plainToInstance(ReadFaqDto, res);
  }

  @Get()
  @Public()
  async findAll(): Promise<ReadFaqDto[]> {
    const res = await this.faqService.findAll();
    return plainToInstance(ReadFaqDto, res);
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, type: ReadFaqDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async findOne(@Param() dto: FaqIdDto): Promise<ReadFaqDto> {
    const res = await this.faqService.findOne(dto.id);
    return plainToInstance(ReadFaqDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadFaqDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'FAQ with this ID does not exist' })
  async update(@Body() updateFaqDto: UpdateFaqDto): Promise<ReadFaqDto> {
    const res = await this.faqService.update(updateFaqDto);
    return plainToInstance(ReadFaqDto, res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'FAQ with this ID does not exist' })
  async remove(@Param() dto: FaqIdDto): Promise<void> {
    await this.faqService.remove(dto.id);
  }
}
