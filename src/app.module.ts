import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClubsModule } from './clubs/clubs.module';
import { DepartmentsModule } from './departments/departments.module';
import { FaqModule } from './faq/faq.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RedisOptions } from './redis/redis-options';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './auth/guards';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ImgurModule } from './imgur/imgur.module';
import { DocumentsModule } from './documents/documents.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    PrismaModule,
    FaqModule,
    ClubsModule,
    ScheduleModule,
    DepartmentsModule,
    AuthModule,
    UsersModule,
    MailModule,
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 60, limit: 10 },
        { name: 'medium', ttl: 60, limit: 10 },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
    ImgurModule,
    DocumentsModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
