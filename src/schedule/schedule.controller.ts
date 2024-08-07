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
import ms from 'ms';
import { Public } from 'src/auth/decorators';
import { plainToInstance } from 'class-transformer';
import { AuthUrlDto } from './dto/auth-url.dto';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  private readonly logger = new Logger(ScheduleController.name);

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly config: ConfigService,
  ) {}

  @Get('auth')
  @Public()
  async googleAuth(): Promise<AuthUrlDto> {
    const url = this.scheduleService.generateAuthUrl();
    const res = {
      authUrl: url,
    };
    return plainToInstance(AuthUrlDto, res);
  }

  @Get('callback')
  @Public()
  async googleAuthCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error) {
      //Authorization denied
      return res.redirect(this.config.get<string>('FRONTEND_HOME_URI'));
    }
    //code missing
    if (!code) {
      this.logger.error('Code from Google is missing');
      return res.redirect(this.config.get<string>('FRONTEND_IMPORT_PAGE_URI'));
    }

    try {
      const tokens = await this.scheduleService.getUserTokens(code);

      res.cookie('tokens', JSON.stringify(tokens), {
        httpOnly: true,
        sameSite: 'none',
        maxAge: ms('15m'),
        secure: true,
      });

      return res.redirect(this.config.get<string>('FRONTEND_IMPORT_PAGE_URI'));
    } catch (error) {
      //server error
      this.logger.error('Error during token exchange: ', error);
      return res.redirect(this.config.get<string>('FRONTEND_IMPORT_PAGE_URI'));
    }
  }

  @Post('create')
  @Public()
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
      sameSite: 'none',
      maxAge: ms('15m'),
      secure: true,
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
