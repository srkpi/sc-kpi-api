import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { Public } from 'src/auth/decorators';
import { plainToInstance } from 'class-transformer';
import { ReadCalendarEventDto } from './dto/read-calendar-event.dto';
import { CalendarEventIdDto } from './dto/calendar-event-id.dto';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('calendar')
@Public()
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/event')
  @ApiResponse({ status: HttpStatus.OK, type: [ReadCalendarEventDto] })
  async getAllEvents(): Promise<ReadCalendarEventDto[]> {
    const res = await this.calendarService.getAllEvents();
    return plainToInstance(ReadCalendarEventDto, res);
  }

  @Get('/event/:calendarEventId')
  @ApiResponse({ status: HttpStatus.OK, type: ReadCalendarEventDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
  async getEvent(
    @Param() dto: CalendarEventIdDto,
  ): Promise<ReadCalendarEventDto> {
    const res = await this.calendarService.getEvent(dto.calendarEventId);
    return plainToInstance(ReadCalendarEventDto, res);
  }

  @Post('/event')
  @ApiBody({ type: CreateCalendarEventDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReadCalendarEventDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async createEvent(
    @Body() dto: CreateCalendarEventDto,
  ): Promise<ReadCalendarEventDto> {
    const res = await this.calendarService.createEvent(dto);
    return plainToInstance(ReadCalendarEventDto, res);
  }

  @Patch('/event')
  @ApiResponse({ status: HttpStatus.OK, type: ReadCalendarEventDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event with this ID does not exist',
  })
  async updateEvent(
    @Body() dto: UpdateCalendarEventDto,
  ): Promise<ReadCalendarEventDto> {
    const res = await this.calendarService.updateEvent(dto);
    return plainToInstance(ReadCalendarEventDto, res);
  }

  @Delete('/event/:calendarEventId')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Event deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event with this ID does not exist',
  })
  async deleteEvent(@Param() dto: CalendarEventIdDto): Promise<void> {
    await this.calendarService.deleteEvent(dto.calendarEventId);
  }
}
