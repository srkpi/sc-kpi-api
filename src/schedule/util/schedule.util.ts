import { Courses } from '../enums/courses.enum';

export class ScheduleUtil {
  static getSemesterStart(courseIdentifier: number) {
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
    if (kyivDate.getMonth() < 7) {
      startYear--;
    } else if (kyivDate.getMonth() == 7 && kyivDate.getDate() < 31) {
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

    if (courseIdentifier === Courses['6 курс ОНП']) {
      const semesterEnd = new Date(semesterStartFirst);
      semesterEnd.setDate(semesterEnd.getDate() + 18 * 7);
      return {
        semester: 1,
        semesterStart: semesterStartFirst,
        semesterEnd,
      };
    }

    const scheduleStartSecond = new Date(semesterStartFirst);
    scheduleStartSecond.setDate(scheduleStartSecond.getDate() + 22 * 7 - 1);
    const semesterStartSecond = new Date(semesterStartFirst);
    semesterStartSecond.setDate(semesterStartSecond.getDate() + 22 * 7);

    const semester =
      kyivDate >= scheduleStartFirst && kyivDate < scheduleStartSecond ? 1 : 2;

    const semesterEnd = new Date(
      semester === 1 ? semesterStartFirst : semesterStartSecond,
    );
    semesterEnd.setDate(
      semesterEnd.getDate() +
        (courseIdentifier !== Courses['4 курс'] ? 18 : 9) * 7,
    );

    return {
      semester,
      semesterStart: semester === 1 ? semesterStartFirst : semesterStartSecond,
      semesterEnd,
    };
  }

  private static getTimezoneOffset(timeZone: string) {
    const str = new Date().toLocaleString('en', {
      timeZone,
      timeZoneName: 'longOffset',
    });
    const [_, h, m] = str.match(/([+-]\d+):(\d+)$/) || [, '+00', '00'];
    return -(+h * 60 + (+h > 0 ? +m : -m));
  }

  static formatDateToUTCString(date: Date, timeZone: string, isISO: boolean) {
    const offset = this.getTimezoneOffset(timeZone);

    const utcDate = new Date(date.getTime() + offset * 60000);

    const year = utcDate.getUTCFullYear();
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getUTCDate()).padStart(2, '0');
    const hours = String(utcDate.getUTCHours()).padStart(2, '0');
    const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getUTCSeconds()).padStart(2, '0');

    if (isISO) {
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    }

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  static shortenPosition(position: string) {
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

  static shortenFullName(fullName: string) {
    return fullName
      .split(' ')
      .map((value, index) => (index > 0 ? `${value[0].toUpperCase()}.` : value))
      .join(' ');
  }
}
