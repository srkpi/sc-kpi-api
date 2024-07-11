import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  private readonly logger = new Logger(ScheduleController.name);

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly config: ConfigService,
  ) {}

  @Get('auth')
  async googleAuth(@Res() res: Response) {
    const url = this.scheduleService.generateAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async googleAuthCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error) {
      //Authorization denied
      return res.redirect(
        this.config.get<string>('FRONTEND_DEFAULT_SCHEDULE_URI'),
      );
    }
    //code missing
    if (!code) {
      this.logger.error('Code from Google is missing');
      return res.redirect(
        this.config.get<string>('FRONTEND_SERVER_ERROR_PAGE'),
      );
    }

    try {
      const tokens = await this.scheduleService.getUserTokens(code);

      res.cookie('tokens', JSON.stringify(tokens), {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 900000, //15 minutes
      });

      return res.redirect(this.config.get<string>('FRONTEND_IMPORT_PAGE_URI'));
    } catch (error) {
      //server error
      this.logger.error('Error during token exchange: ', error);
      return res.redirect(
        this.config.get<string>('FRONTEND_SERVER_ERROR_PAGE'),
      );
    }
  }

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Calendar created and events added',
  })
  @ApiResponse({ status: 400, description: 'Time is up' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async createCallback(
    @Req() req: Request,
    @Body() scheduleDto: CreateScheduleDto,
    @Res() res: Response,
  ) {
    const tokensString = req.cookies['tokens'];
    res.clearCookie('tokens', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 900000, //15 minutes
    });

    if (!tokensString) {
      return res.status(400).json({ message: 'Time is up' });
    }
    try {
      const oauth2Client = await this.scheduleService.getUserClient(
        JSON.parse(tokensString),
      );
      await this.scheduleService.createSemesterSchedule(
        scheduleDto,
        oauth2Client,
      );
      return res
        .status(201)
        .json({ message: 'Calendar created and events added' });
    } catch (e) {
      this.logger.error('Error during calendar creation: ', e);
      return res
        .status(500)
        .json({ message: 'Error during calendar creation' });
    }
  }
}
