import { Report } from './report-entity';
import { ReportRepository } from './report-repository';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';
export declare class ReportsService {
    private reportRepository;
    constructor(reportRepository: ReportRepository);
    getReports(filterDto: GetReportsFilterDto): Promise<Report[]>;
    getReportById(id: number): Promise<Report>;
    createReport(createReportDto: CreateReportDto): Promise<Report>;
    deleteReport(id: number): Promise<void>;
    updateReportStatus(id: number, status: ReportStatus): Promise<Report>;
}
