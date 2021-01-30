import { Body, Controller, Header, Post } from '@nestjs/common';
import { ThreatsService } from './threats.service';

// here post request with file
@Controller('threats')
export class ThreatsController {
  constructor(private threatsService: ThreatsService) {}

  @Post()
  async uploadFile(@Body() file: string) {
    this.threatsService.parse(file);
  }
}
