import { Repository } from 'typeorm';
import { Report } from './report-entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsFilterDto } from './dto/get-report-filter.dto';
export declare class ReportRepository extends Repository<Report> {
    getReports(filterDto: GetReportsFilterDto): Promise<Report[]>;
    createReport(createReportDto: CreateReportDto): Promise<Report>;
}
