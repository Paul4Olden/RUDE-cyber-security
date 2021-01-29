import { Module } from '@nestjs/common';
import { CsReportsController } from './cs-reports.controller';
import { CsReportsService } from './cs-reports.service';

@Module({
  controllers: [CsReportsController],
  providers: [CsReportsService]
})
export class CsReportsModule {}
