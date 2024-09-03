import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  imports: [PrismaModule],
})
export class CalendarModule {}
