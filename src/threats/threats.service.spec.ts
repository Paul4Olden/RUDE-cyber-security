import { Test, TestingModule } from '@nestjs/testing';
import { ThreatsService } from './threats.service';
import { ThreatsController } from './threats.controller';
import { HttpModule, INestApplication } from '@nestjs/common';
import { ThreatsModule } from './threats.module';

describe('ThreatsService', () => {
  let app: INestApplication;
  let threatsController: ThreatsController;
  let threatsService: ThreatsService;

  beforeEach(async () => {
    threatsService = new ThreatsService();
    threatsController = new ThreatsController(threatsService);
  });

  describe('Log', () => {
    it('should log all the info', async () => {
      
    });
  });
});
