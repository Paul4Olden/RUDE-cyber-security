import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThreatsService } from './threats.service';

// here post request with file
@Controller('/threats')
export class ThreatsController {
  constructor(private threatsService: ThreatsService) {}

  @Get()
  getAllThreats() {
    return this.threatsService.getAllThreats();
  }

  @Get('/:id')
  getThreatById(@Param('id') id: string) {
    return this.threatsService.getThreatById(id);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file.buffer.toString());

    return this.threatsService.parse(file.buffer.toString(), file.originalname);
  }
}
