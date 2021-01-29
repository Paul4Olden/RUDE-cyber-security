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
import { CsReportsService } from './csreports.service';
import { CsReportStatus } from './csreports-status.enum';
import { CreateCsReportDto } from './dto/create-csreport.dto';
import { GetCsReportsFilterDto } from './dto/get-csreport-filter.dto';
import { CsReportStatusValidationPipe } from './pipes/csreport-status-validation.pipe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CsReport } from './csreport-entity';

@Controller('csreports')
export class CsReportsController {
  constructor(private csReportsService: CsReportsService) {}

  @Get()
  getCsReports(@Query(ValidationPipe) filterDto: GetCsReportsFilterDto) {
    return this.csReportsService.getCsReports(filterDto);
  }

  @Get('/:id')
  getCsReportById(@Param('id', ParseIntPipe) id: number): Promise<CsReport> {
    return this.csReportsService.getCsReportById(id);
  }

  @Delete('/:id')
  deleteCsReport(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.csReportsService.deleteCsReport(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCsReport(
    @Body() createCsReportDto: CreateCsReportDto,
  ): Promise<CsReport> {
    return this.csReportsService.createCsReport(createCsReportDto);
  }

  @Patch('/:id/status')
  updateCsReportStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', CsReportStatusValidationPipe) status: CsReportStatus,
  ): Promise<CsReport> {
    return this.csReportsService.updateCsReportStatus(id, status);
  }
}
