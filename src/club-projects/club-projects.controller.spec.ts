import { Test, TestingModule } from '@nestjs/testing';
import { ClubProjectsController } from './club-projects.controller';
import { ClubProjectsService } from './club-projects.service';

describe('ClubProjectsController', () => {
  let controller: ClubProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubProjectsController],
      providers: [ClubProjectsService],
    }).compile();

    controller = module.get<ClubProjectsController>(ClubProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
