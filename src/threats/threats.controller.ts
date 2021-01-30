import { Body, Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThreatsService } from './threats.service';

// here post request with file
@Controller('threats')
export class ThreatsController {
  private readonly logger = new Logger(ThreatsController.name);
  constructor(private threatsService: ThreatsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    this.threatsService.parse(file.toString(), file.name);
  }
}
