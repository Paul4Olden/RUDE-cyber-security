"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const typeorm_1 = require("typeorm");
const report_entity_1 = require("./report-entity");
const reports_status_enum_1 = require("./reports-status.enum");
let ReportRepository = class ReportRepository extends typeorm_1.Repository {
    async getReports(filterDto) {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('report');
        if (status) {
            query.andWhere('report.status = :status', { status });
        }
        if (search) {
            query.andWhere('(report.title LIKE :search OR report.description LIKE :search)', { search: `%${search}%` });
        }
        const reports = await query.getMany();
        return reports;
    }
    async createReport(createReportDto) {
        const { title, description } = createReportDto;
        const report = new report_entity_1.Report();
        report.title = title;
        report.description = description;
        report.status = reports_status_enum_1.ReportStatus.PENDING;
        await report.save();
        return report;
    }
};
ReportRepository = __decorate([
    typeorm_1.EntityRepository(report_entity_1.Report)
], ReportRepository);
exports.ReportRepository = ReportRepository;
//# sourceMappingURL=report-repository.js.map