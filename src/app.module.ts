import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClubsModule } from './clubs/clubs.module';
import { DepartmentsModule } from './departments/departments.module';
import { FaqModule } from './faq/faq.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './auth/guards';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ImgurModule } from './imgur/imgur.module';
import { DocumentsModule } from './documents/documents.module';
import { CalendarModule } from './calendar/calendar.module';
import { ServicesModule } from './services/services.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { getRedisOptions } from './redis/redis-options';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FaqModule,
    ClubsModule,
    ScheduleModule,
    DepartmentsModule,
    AuthModule,
    UsersModule,
    MailModule,
    RedisModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: ['REDIS_CLIENT'],
      useFactory: (redisClient: Redis) => ({
        throttlers: [
          { name: 'short', ttl: 60, limit: 10 },
          { name: 'medium', ttl: 60, limit: 10 },
        ],
        storage: new ThrottlerStorageRedisService(redisClient),
      }),
    }),
    ImgurModule,
    DocumentsModule,
    CalendarModule,
    ServicesModule,
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
