import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import {CreateGreetingDto} from "./dto/create-greeting.dto";
import {plainToInstance} from "class-transformer";
import {GreetingResponseCreationDto} from "./dto/greeting-response-creation.dto";
import {GreetingIdDto} from "./dto/greeting-id.dto";
import {GreetingResponseInfoDto} from "./dto/greeting-response-info.dto";
import {UpdateGreetingDto} from "./dto/update-greeting.dto";
import {MessageResponseDto} from "./dto/message-response.dto";

@Controller('greetings')
export class GreetingsController {
  constructor(private readonly greetingsService: GreetingsService) {}

  @Get('/info')
  async getAllGreetings(): Promise<GreetingResponseInfoDto[]> {
    const greetingsInfo = await this.greetingsService.getAllGreetings();
    return plainToInstance(GreetingResponseInfoDto, greetingsInfo);
  }

  @Get('/info/:id')
  async getGreetingInfo(@Param() dto: GreetingIdDto): Promise<GreetingResponseInfoDto> {
    const greetingInfo = await this.greetingsService.getGreetingInfo(dto);
    return plainToInstance(GreetingResponseInfoDto, greetingInfo);
  }

  @Get(':id')
  async getGreeting(@Param() dto: GreetingIdDto): Promise<string> {
    return this.greetingsService.getGreeting(dto);
  }

  @Post()
  async createGreeting(@Body() dto: CreateGreetingDto): Promise<GreetingResponseCreationDto> {
    const newGreeting = await this.greetingsService.createGreeting(dto);
    return plainToInstance(GreetingResponseCreationDto, newGreeting);
  }

  @Put()
  async updateGreeting(@Body() dto: UpdateGreetingDto): Promise<GreetingResponseCreationDto> {
    const updatedGreeting = await this.greetingsService.updateGreeting(dto);
    return plainToInstance(GreetingResponseCreationDto, updatedGreeting);
  }

  @Delete(':id')
  async deleteGreeting(@Param() dto: GreetingIdDto): Promise<MessageResponseDto> {
    const message = await this.greetingsService.deleteGreeting(dto);
    return plainToInstance(MessageResponseDto, message);
  }
}
