import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';
import { ReportStatusValidationPipe } from './pipes/report-status-validation.pipe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Report } from './report-entity';

@Controller('csreports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getReports(@Query(ValidationPipe) filterDto: GetReportsFilterDto) {
    return this.reportsService.getReports(filterDto);
  }

  @Get('/:id')
  getReportById(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    return this.reportsService.getReportById(id);
  }

  @Delete('/:id')
  deleteReport(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reportsService.deleteReport(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createReport(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.createReport(createReportDto);
  }

  @Patch('/:id/status')
  updateReportStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ReportStatusValidationPipe) status: ReportStatus,
  ): Promise<Report> {
    return this.reportsService.updateReportStatus(id, status);
  }
}
