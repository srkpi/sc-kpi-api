import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ImgurModule } from 'src/imgur/imgur.module';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [ImgurModule, PrismaModule],
})
export class ServicesModule {}
