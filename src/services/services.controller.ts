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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';
import { FileInterceptor } from '@nestjs/platform-express';
import convert from 'convert';
import { validateOrReject } from 'class-validator';
import { ReadServiceDto } from './dto/read-service.dto';
import { ServiceIdDto } from './dto/service-id.dto';

@ApiTags('services')
@Roles(Role.Admin)
@Controller('services')
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name);

  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, type: ReadServiceDto })
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
    @Body('json') createServiceDtoString: string,
  ): Promise<ReadServiceDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');

    let createServiceDto: CreateServiceDto;
    try {
      createServiceDto = JSON.parse(createServiceDtoString);
    } catch (error) {
      this.logger.error('Invalid json');
      throw new BadRequestException('Bad request body');
    }

    try {
      await validateOrReject(
        plainToInstance(CreateServiceDto, createServiceDto),
      );
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const res = await this.servicesService.create(createServiceDto, image);
    return plainToInstance(ReadServiceDto, res);
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: [ReadServiceDto] })
  async findAll(): Promise<ReadServiceDto[]> {
    const res = await this.servicesService.findAll();
    return plainToInstance(ReadServiceDto, res);
  }

  @Get(':serviceId')
  @Public()
  @ApiResponse({ status: 200, type: ReadServiceDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param() dto: ServiceIdDto): Promise<ReadServiceDto> {
    const res = await this.servicesService.findOne(dto.serviceId);
    return plainToInstance(ReadServiceDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadServiceDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Service with this ID does not exist',
  })
  async update(
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ReadServiceDto> {
    const res = await this.servicesService.update(updateServiceDto);
    return plainToInstance(ReadServiceDto, res);
  }

  @Patch('/image/:serviceId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 200, type: ReadServiceDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Service with this ID does not exist',
  })
  async updateImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: convert(25, 'MiB').to('B') }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param() dto: ServiceIdDto,
  ): Promise<ReadServiceDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');
    const res = await this.servicesService.updateImage(image, dto.serviceId);
    return plainToInstance(ReadServiceDto, res);
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Service deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Service with this ID does not exist',
  })
  async remove(@Param() dto: ServiceIdDto): Promise<void> {
    await this.servicesService.remove(dto.serviceId);
  }
}
