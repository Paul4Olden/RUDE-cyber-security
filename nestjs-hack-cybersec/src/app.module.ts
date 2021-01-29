import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsReportsModule } from './cs-reports/cs-reports.module';

@Module({
  imports: [CsReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
