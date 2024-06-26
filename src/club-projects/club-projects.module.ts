import { Module } from '@nestjs/common';
import { ClubProjectsService } from './club-projects.service';
import { ClubProjectsController } from './club-projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ClubProjectsController],
  providers: [ClubProjectsService],
  imports: [PrismaModule],
})
export class ClubProjectsModule {}
