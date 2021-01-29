import { Module } from '@nestjs/common';
import { CsReportsController } from './csreports.controller';
import { CsReportsService } from './csreports.service';

@Module({
  controllers: [CsReportsController],
  providers: [CsReportsService],
})
export class CsReportsModule {}
