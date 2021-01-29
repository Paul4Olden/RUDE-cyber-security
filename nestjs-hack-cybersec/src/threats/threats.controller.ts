import { Controller } from '@nestjs/common';
import { ThreatsService } from './threats.service';

// here post request with file
@Controller('threats')
export class ThreatsController {
  constructor(private threatsService: ThreatsService) {}
}
