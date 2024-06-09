import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GreetingsModule } from './greetings/greetings.module';
import {ConfigModule} from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
      GreetingsModule,
      ConfigModule.forRoot(),
      PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
