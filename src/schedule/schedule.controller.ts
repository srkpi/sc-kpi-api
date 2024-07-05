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
import { ApiTags } from '@nestjs/swagger';
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
    //properly handle code missing
    if (!code) {
      return res.redirect(
        this.config.get<string>('FRONTEND_DEFAULT_SCHEDULE_URI'),
      );
      // return res.status(400).json({ message: 'Authorization code missing' });
    }

    try {
      res.cookie('oauth_code', code, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 900000, //15 minutes
      });

      // question about data transfer
      return res.redirect(this.config.get<string>('FRONTEND_IMPORT_PAGE_URI'));
    } catch (error) {
      //handle redirect
      this.logger.error('Error during token exchange: ', error);
      return res.redirect(
        this.config.get<string>('FRONTEND_DEFAULT_SCHEDULE_URI'),
      );
      // return res
      //   .status(500)
      //   .json({ message: 'Error during token exchange', error: error.message });
    }
  }

  @Post('create')
  async createCallback(
    @Req() req: Request,
    @Body() scheduleDto: CreateScheduleDto,
    @Res() res: Response,
  ) {
    const code = req.cookies['oauth_code'];
    res.clearCookie('oauth_code', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 900000, //15 minutes
    });
    if (!code) {
      return res.status(400).json({ message: 'Authorization code missing' });
    }
    try {
      const oauth2Client = await this.scheduleService.getUserClient(code);
      await this.scheduleService.createSemesterSchedule(
        scheduleDto,
        oauth2Client,
      );
      return res.json({ message: 'Calendar created and events added' });
    } catch (e) {
      this.logger.error('Error during calendar creation: ', e);
      return res
        .status(500)
        .json({ message: 'Error during calendar creation' });
    }
  }
}
