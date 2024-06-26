import { Test, TestingModule } from '@nestjs/testing';
import { ClubProjectsService } from './club-projects.service';

describe('ClubProjectsService', () => {
  let service: ClubProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubProjectsService],
    }).compile();

    service = module.get<ClubProjectsService>(ClubProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
