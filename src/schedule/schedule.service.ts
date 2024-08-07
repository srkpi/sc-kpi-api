import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { firstValueFrom } from 'rxjs';
import { SchedulePairDto } from './dto/schedule-pair.dto';
import { HttpService } from '@nestjs/axios';
import { ScheduleUtil } from './util/schedule.util';
import { Courses } from './enums/courses.enum';
import ms from 'ms';

@Injectable()
export class ScheduleService {
  constructor(
    private config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  createOAuth2Client(): OAuth2Client {
    return new OAuth2Client(
      this.config.get<string>('GOOGLE_CLIENT_ID'),
      this.config.get<string>('GOOGLE_CLIENT_SECRET'),
      this.config.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  generateAuthUrl(): string {
    const oauth2Client = this.createOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];
    return oauth2Client.generateAuthUrl({
      scope: scopes,
    });
  }

  async getUserTokens(code: string) {
    const oauth2Client = this.createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    tokens.expiry_date = Date.now() + ms('15m');
    return tokens;
  }

  async getUserClient(tokens: Credentials) {
    const oauth2Client = this.createOAuth2Client();
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
  }

  async createCalendar(
    oauth2Client: OAuth2Client,
    groupName: string,
    semester: number,
  ) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const summary = `${groupName}. Семестр ${semester}`;
    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary,
        timeZone: 'Europe/Kyiv',
      },
    });
    return newCalendar.data;
  }

  private async generatePairEventInfo(pairData: SchedulePairDto) {
    const encodedName = encodeURIComponent(pairData.teacherName);
    const urlFindId = `https://api.campus.kpi.ua/intellect/v2/find?value=${encodedName}&pageNumber=1&pageSize=1`;
    const responseFindIdData = (
      await firstValueFrom(this.httpService.get(urlFindId))
    ).data;

    let position = '';
    let subdivision = '';
    if (responseFindIdData.data.length !== 0) {
      const teacherData = responseFindIdData.data[0];
      const intellectId = teacherData.userIdentifier;

      const urlActualData = `https://api.campus.kpi.ua/account/public/${intellectId}`;
      const responseActualData = (
        await firstValueFrom(this.httpService.get(urlActualData))
      ).data;
      const positionData = responseActualData.positions[0];

      if (positionData) {
        position = positionData.name;
        subdivision = ' ' + positionData.subdivision.name + ' ';
      }
    } else {
      position = 'пос.';
    }

    const shortenedPosition = ScheduleUtil.shortenPosition(position);
    const shortenedFullName = ScheduleUtil.shortenFullName(
      pairData.teacherName,
    );

    const summary = `${pairData.name} [${pairData.place} ${pairData.type}] (${shortenedPosition} ${shortenedFullName})`;
    const description = `${pairData.place} ${pairData.type} з ${pairData.name}, викладач: ${position.toLowerCase()}${subdivision ? subdivision : ' '}${pairData.teacherName}`;
    return {
      summary,
      description,
    };
  }

  private async createPairEvent(
    oauth2Client: OAuth2Client,
    calendarId: string,
    pairData: SchedulePairDto,
    pairStart: Date,
    pairEnd: Date,
    semesterEndDate: Date,
  ) {
    const pairEventInfo = await this.generatePairEventInfo(pairData);
    const untilDateFormatted = ScheduleUtil.formatDateToUTCString(
      semesterEndDate,
      'Europe/Kyiv',
    );
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    return await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: pairEventInfo.summary,
        description: pairEventInfo.description,
        start: {
          dateTime: ScheduleUtil.getISOString(pairStart), // Should be in ISO 8601 format
          timeZone: 'Europe/Kyiv',
        },
        end: {
          dateTime: ScheduleUtil.getISOString(pairEnd), // Should be in ISO 8601 format
          timeZone: 'Europe/Kyiv',
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 5 }],
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=${untilDateFormatted}`, // UNTIL should be in YYYYMMDDTHHMMSSZ format
        ],
      },
    });
  }

  async createSemesterSchedule(
    scheduleDto: CreateScheduleDto,
    oauth2Client: OAuth2Client,
  ) {
    const { semester, semesterStart, semesterEnd } =
      ScheduleUtil.getSemesterStart(Courses[scheduleDto.courseIdentifier]);
    const calendarData = await this.createCalendar(
      oauth2Client,
      scheduleDto.groupName,
      semester,
    );
    const PAIR_MINUTES = 95;

    const weeks = [
      scheduleDto.scheduleFirstWeek,
      scheduleDto.scheduleSecondWeek,
    ];

    for (const [weekIndex, weekData] of weeks.entries()) {
      const startWeekDate = new Date(semesterStart);
      startWeekDate.setDate(semesterStart.getDate() + weekIndex * 7);
      for (const [dayIndex, dayData] of weekData.entries()) {
        const dayDate = new Date(startWeekDate);
        dayDate.setDate(dayDate.getDate() + dayIndex);
        for (const pair of dayData.pairs) {
          const time = pair.time.split('.').map((value) => parseInt(value));
          const [hours, minutes] = time;
          const pairStart = new Date(dayDate);
          pairStart.setHours(hours, minutes);
          const pairEnd = new Date(pairStart);
          pairEnd.setTime(pairStart.getTime() + PAIR_MINUTES * 60 * 1000);
          await this.createPairEvent(
            oauth2Client,
            calendarData.id,
            pair,
            pairStart,
            pairEnd,
            semesterEnd,
          );
        }
      }
    }
  }
}
