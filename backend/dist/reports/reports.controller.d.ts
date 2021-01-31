import { ReportsService } from './reports.service';
import { ReportStatus } from './reports-status.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';
import { Report } from './report-entity';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getReports(filterDto: GetReportsFilterDto): Promise<Report[]>;
    getReportById(id: number): Promise<Report>;
    deleteReport(id: number): Promise<void>;
    createReport(createReportDto: CreateReportDto): Promise<Report>;
    updateReportStatus(id: number, status: ReportStatus): Promise<Report>;
}
