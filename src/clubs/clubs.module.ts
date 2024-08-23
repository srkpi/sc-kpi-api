import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClubProjectsModule } from './projects/projects.module';
import { ImgurModule } from 'src/imgur/imgur.module';

@Module({
  controllers: [ClubsController],
  providers: [ClubsService],
  imports: [PrismaModule, ClubProjectsModule, ImgurModule],
})
export class ClubsModule {}
