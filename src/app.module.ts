import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubsModule } from './clubs/clubs.module';
import { FaqModule } from './faq/faq.module';
import { GreetingsModule } from './greetings/greetings.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    GreetingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FaqModule,
    ClubsModule,
    DepartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
