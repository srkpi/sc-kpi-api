import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClubProjectsModule } from './projects/projects.module';

@Module({
  controllers: [ClubsController],
  providers: [ClubsService],
  imports: [PrismaModule, ClubProjectsModule],
})
export class ClubsModule {}
