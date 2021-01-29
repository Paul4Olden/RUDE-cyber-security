import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CsReport } from './csreport-entity';
import { CsReportRepository } from './csreport-repository';
import { CsReportStatus } from './csreports-status.enum';
import { CreateCsReportDto } from './dto/create-csreport.dto';
import { GetCsReportsFilterDto } from './dto/get-csreport-filter.dto';

@Injectable()
export class CsReportsService {
  constructor(
    @InjectRepository(CsReportRepository)
    private csReportRepository: CsReportRepository,
  ) {}

  async getCsReports(filterDto: GetCsReportsFilterDto): Promise<CsReport[]> {
    return this.csReportRepository.getCsReports(filterDto);
  }

  async getCsReportById(id: number): Promise<CsReport> {
    const found = await this.csReportRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`CsReport with ${id} not found`);
    }

    return found;
  }

  async createCsReport(
    createCsReportDto: CreateCsReportDto,
  ): Promise<CsReport> {
    return this.csReportRepository.createCsReport(createCsReportDto);
  }

  async deleteCsReport(id: number): Promise<void> {
    const result = await this.csReportRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`CsReport with ${id} not found`);
    }
  }

  async updateCsReportStatus(
    id: number,
    status: CsReportStatus,
  ): Promise<CsReport> {
    const csReport = await this.getCsReportById(id);
    csReport.status === status;
    await csReport.save();
    return csReport;
  }
}
