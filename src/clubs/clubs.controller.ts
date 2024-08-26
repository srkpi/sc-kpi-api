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
import { ClubsService } from './clubs.service';
import { ClubIdDto } from './dto/club-id.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { ReadClubDto } from './dto/read-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/types';
import { FileInterceptor } from '@nestjs/platform-express';
import convert from 'convert';
import { validateOrReject } from 'class-validator';

@ApiTags('clubs')
@Roles(Role.Admin)
@Controller('clubs')
export class ClubsController {
  private readonly logger = new Logger(ClubsController.name);

  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({ status: 201, type: ReadClubDto })
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
    @Body('json') createClubDtoString: string,
  ): Promise<ReadClubDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');

    let createClubDto: CreateClubDto;
    try {
      createClubDto = JSON.parse(createClubDtoString);
    } catch (error) {
      this.logger.error('Invalid json');
      throw new BadRequestException('Bad request body');
    }

    try {
      await validateOrReject(plainToInstance(CreateClubDto, createClubDto));
    } catch (errors) {
      throw new BadRequestException(errors);
    }

    const res = await this.clubsService.create(createClubDto, image);
    return plainToInstance(ReadClubDto, res);
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: [ReadClubDto] })
  async findAll(): Promise<ReadClubDto[]> {
    const res = await this.clubsService.findAll();
    return plainToInstance(ReadClubDto, res);
  }

  @Get(':clubId')
  @Public()
  @ApiResponse({ status: 200, type: ReadClubDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Club not found' })
  async findOne(@Param() dto: ClubIdDto): Promise<ReadClubDto> {
    const res = await this.clubsService.findOne(dto.clubId);
    return plainToInstance(ReadClubDto, res);
  }

  @Patch()
  @ApiResponse({ status: 200, type: ReadClubDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Club with this ID does not exist' })
  async update(@Body() updateClubDto: UpdateClubDto): Promise<ReadClubDto> {
    const res = await this.clubsService.update(updateClubDto);
    return plainToInstance(ReadClubDto, res);
  }

  @Patch('/image/:clubId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 200, type: ReadClubDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Club with this ID does not exist' })
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
    @Param() dto: ClubIdDto,
  ): Promise<ReadClubDto> {
    if (!file) {
      throw new BadRequestException('No picture uploaded');
    }
    const image = file.buffer.toString('base64');
    const res = await this.clubsService.updateImage(image, dto.clubId);
    return plainToInstance(ReadClubDto, res);
  }

  @Delete(':clubId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Club deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Club with this ID does not exist' })
  async remove(@Param() dto: ClubIdDto): Promise<void> {
    await this.clubsService.remove(dto.clubId);
  }
}
