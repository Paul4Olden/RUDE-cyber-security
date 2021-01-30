import { EntityRepository, Repository } from 'typeorm';
import { Report } from './report-entity';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async getReports(filterDto: GetReportsFilterDto): Promise<Report[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('report');

    if (status) {
      query.andWhere('report.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(report.title LIKE :search OR report.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const reports = await query.getMany();
    return reports;
  }

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const { title, description } = createReportDto;

    const report = new Report();
    report.title = title;
    report.description = description;
    report.status = ReportStatus.PENDING;
    await report.save();

    return report;
  }
}
