import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { ThreatsService } from './threats/threats.service';

@Module({
  imports: [ReportsModule],
  controllers: [AppController],
  providers: [AppService, ThreatsService],
})
export class AppModule {}
