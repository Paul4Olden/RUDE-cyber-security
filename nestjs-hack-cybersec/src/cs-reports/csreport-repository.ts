import { EntityRepository, Repository } from 'typeorm';
import { CsReport } from './csreport-entity';
import { CsReportStatus } from './csreports-status.enum';
import { CreateCsReportDto } from './dto/create-csreport.dto';
import { GetCsReportsFilterDto } from './dto/get-csreport-filter.dto';

@EntityRepository(CsReport)
export class CsReportRepository extends Repository<CsReport> {
  async getCsReports(filterDto: GetCsReportsFilterDto): Promise<CsReport[]> {
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

  async createCsReport(
    createCsReportDto: CreateCsReportDto,
  ): Promise<CsReport> {
    const { title, description } = createCsReportDto;

    const csreport = new CsReport();
    csreport.title = title;
    csreport.description = description;
    csreport.status = CsReportStatus.PENDING;
    await csreport.save();

    return csreport;
  }
}
