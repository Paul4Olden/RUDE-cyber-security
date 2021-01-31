import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report-entity';
import { ReportRepository } from './report-repository';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository
  ) {}

  async getReports(filterDto: GetReportsFilterDto): Promise<Report[]> {
    return this.reportRepository.getReports(filterDto);
  }

  async getReportById(id: number): Promise<Report> {
    const found = await this.reportRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Report with ${id} not found`);
    }

    return found;
  }

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    return this.reportRepository.createReport(createReportDto);
  }

  async deleteReport(id: number): Promise<void> {
    const result = await this.reportRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ${id} not found`);
    }
  }

  async updateReportStatus(id: number, status: ReportStatus): Promise<Report> {
    const report = await this.getReportById(id);
    report.status === status;
    await report.save();
    return report;
  }
}
