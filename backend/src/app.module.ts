import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { ThreatsController } from './threats/threats.controller';
import { ThreatsModule } from './threats/threats.module';
import { ThreatsService } from './threats/threats.service';

@Module({
  imports: [ ThreatsModule],
  controllers: [AppController, ThreatsController],
  providers: [AppService, ThreatsService],
})
export class AppModule {}
