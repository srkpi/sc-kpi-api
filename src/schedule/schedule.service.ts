import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { firstValueFrom } from 'rxjs';
import { Weekdays } from './enums/weekdays.enum';
import { SchedulePairDto } from './dto/schedule-pair.dto';
import { HttpService } from '@nestjs/axios';

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

  async getUserClient(code: string) {
    const oauth2Client = this.createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
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

  private getSemesterStart() {
    const currentDate = new Date();
    const kyivFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Kyiv',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    const kyivDateString = kyivFormatter.format(currentDate);
    const [month, day, year] = kyivDateString.split(/[/\s,:]+/).map(Number);

    const kyivDate = new Date(year, month - 1, day);

    let startYear = kyivDate.getFullYear();
    if (kyivDate.getMonth() < 7 && kyivDate.getDate() < 31) {
      startYear--;
    }

    //31 august
    const scheduleStartFirst = new Date(startYear, 7, 31);
    const firstSeptember = new Date(startYear, 8, 1);

    let semesterStartFirst = firstSeptember;
    if (firstSeptember.getDay() > 0 && firstSeptember.getDay() < 4) {
      semesterStartFirst.setDate(
        semesterStartFirst.getDate() - (firstSeptember.getDay() - 1),
      );
    } else {
      let startDay = 2;
      do {
        semesterStartFirst = new Date(startYear, 8, startDay);
        startDay++;
      } while (semesterStartFirst.getDay() !== 1);
    }

    const scheduleStartSecond = new Date(semesterStartFirst);
    scheduleStartSecond.setDate(scheduleStartSecond.getDate() + 22 * 7 - 1);
    // const scheduleEndSecond = new Date(
    //   scheduleStartSecond.getFullYear(),
    //   7,
    //   31,
    // );
    const semesterStartSecond = new Date(semesterStartFirst);
    semesterStartSecond.setDate(semesterStartSecond.getDate() + 22 * 7);

    const semester =
      kyivDate >= scheduleStartFirst && kyivDate < scheduleStartSecond ? 1 : 2;

    let semesterEnd = null;
    if (semester === 1) {
      semesterEnd = new Date(semesterStartFirst);
    } else {
      semesterEnd = new Date(semesterStartSecond);
    }
    semesterEnd.setDate(semesterEnd.getDate() + 18 * 7);

    return {
      semester,
      semesterStart: semester === 1 ? semesterStartFirst : semesterStartSecond,
      semesterEnd,
    };
  }

  private formatDateToGoogleCalendarUTC(date: Date): string {
    const pad = (number) => (number < 10 ? `0${number}` : number);

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  private shortenPosition(position: string) {
    const SHORT_POSITIONS = {
      асистент: 'асис.',
      викладач: 'вик.',
      'старший викладач': 'ст.вик.',
      доцент: 'доц.',
      професор: 'проф.',
      посади: 'пос.',
    };

    return SHORT_POSITIONS[position.toLowerCase()] || position.toLowerCase();
  }

  private shortenFullName(fullName: string) {
    const parts = fullName.split(' ');
    return parts
      .map((value, index) => {
        if (index > 0) {
          return value[0].toUpperCase() + '.';
        }
        return value;
      })
      .join(' ');
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
        subdivision = positionData.subdivision.name;
      }
    }

    const shortenedPosition = this.shortenPosition(position);
    const shortenedFullName = this.shortenFullName(pairData.teacherName);

    const summary = `${pairData.name} [${pairData.place} ${pairData.type}] (${shortenedPosition} ${shortenedFullName})`;
    const description = `${pairData.place} ${pairData.type} з ${pairData.name}, викладач: ${position.toLowerCase()} ${subdivision} ${pairData.teacherName}`;
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
    const untilDateFormatted =
      this.formatDateToGoogleCalendarUTC(semesterEndDate);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    return await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: pairEventInfo.summary,
        description: pairEventInfo.description,
        start: {
          dateTime: pairStart.toISOString(), // Should be in ISO 8601 format
          timeZone: 'Europe/Kyiv',
        },
        end: {
          dateTime: pairEnd.toISOString(), // Should be in ISO 8601 format
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
    const { semester, semesterStart, semesterEnd } = this.getSemesterStart();
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
        const currentDay = Weekdays[dayData.day];
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
