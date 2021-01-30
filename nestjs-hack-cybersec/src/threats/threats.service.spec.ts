import { Test, TestingModule } from '@nestjs/testing';
import { ThreatsService } from './threats.service';
import * as fs from 'fs';

const file = fs.readFileSync(
  '../../test/blob/2011/C5_APT_ADecadeInReview.pdf.txt',
  'utf8',
);

describe('ThreatsService', () => {
  let threatsService = new ThreatsService(file);
});
