import { Test, TestingModule } from '@nestjs/testing';
import { GreetingsService } from './greetings.service';

describe('GreetingsService', () => {
  let service: GreetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingsService],
    }).compile();

    service = module.get<GreetingsService>(GreetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
