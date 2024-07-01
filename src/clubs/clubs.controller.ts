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
import { ClubsService } from './clubs.service';
import { ClubIdDto } from './dto/club-id.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { ReadClubDto } from './dto/read-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiResponse({ status: 201, type: ReadClubDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createClubDto: CreateClubDto): Promise<ReadClubDto> {
    const res = await this.clubsService.create(createClubDto);
    return plainToInstance(ReadClubDto, res);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ReadClubDto] })
  async findAll(): Promise<ReadClubDto[]> {
    const res = await this.clubsService.findAll();
    return plainToInstance(ReadClubDto, res);
  }

  @Get(':clubId')
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

  @Delete(':clubId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Club deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Club with this ID does not exist' })
  async remove(@Param() dto: ClubIdDto): Promise<void> {
    await this.clubsService.remove(dto.clubId);
  }
}
