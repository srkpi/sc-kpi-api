import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ImgurModule } from '../../imgur/imgur.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [PrismaModule, ImgurModule],
})
export class ClubProjectsModule {}
