import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThreatsService } from './threats.service';

// here post request with file
@Controller('/threats')
export class ThreatsController {
  constructor(private threatsService: ThreatsService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    console.log(file.buffer.toString());

    // this.threatsService.parse(file.buffer.toString(), file.originalname);
  }
}
