import { EntityRepository, Repository } from 'typeorm';
import { Report } from './report-entity';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async getReports(filterDto: GetReportsFilterDto): Promise<Report[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('csreport');

    if (status) {
      query.andWhere('csreport.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(csreport.title LIKE :search OR csreport.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const csreports = await query.getMany();
    return csreports;
  }

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const { title, description } = createReportDto;

    const csreport = new Report();
    csreport.title = title;
    csreport.description = description;
    csreport.status = ReportStatus.PENDING;
    await csreport.save();

    return csreport;
  }
}
