import { Module } from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { GreetingsController } from './greetings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [GreetingsController],
  providers: [GreetingsService],
  imports: [PrismaModule],
})
export class GreetingsModule {}
