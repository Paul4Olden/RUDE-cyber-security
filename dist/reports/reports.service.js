"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const report_repository_1 = require("./report-repository");
let ReportsService = class ReportsService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async getReports(filterDto) {
        return this.reportRepository.getReports(filterDto);
    }
    async getReportById(id) {
        const found = await this.reportRepository.findOne(id);
        if (!found) {
            throw new common_1.NotFoundException(`Report with ${id} not found`);
        }
        return found;
    }
    async createReport(createReportDto) {
        return this.reportRepository.createReport(createReportDto);
    }
    async deleteReport(id) {
        const result = await this.reportRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Report with ${id} not found`);
        }
    }
    async updateReportStatus(id, status) {
        const report = await this.getReportById(id);
        report.status === status;
        await report.save();
        return report;
    }
};
ReportsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(report_repository_1.ReportRepository)),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map