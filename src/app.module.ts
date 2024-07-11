import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClubsModule } from './clubs/clubs.module';
import { DepartmentsModule } from './departments/departments.module';
import { FaqModule } from './faq/faq.module';
import { GreetingsModule } from './greetings/greetings.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisOptions } from './redis/redis-options';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './auth/guards';

@Module({
  imports: [
    GreetingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    PrismaModule,
    FaqModule,
    ClubsModule,
    DepartmentsModule,
    AuthModule,
    UsersModule,
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
