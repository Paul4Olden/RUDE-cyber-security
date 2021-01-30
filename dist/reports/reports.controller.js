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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const reports_status_enum_1 = require("./reports-status.enum");
const create_report_dto_1 = require("./dto/create-report.dto");
const get_report_filter_dto_1 = require("./dto/get-report-filter.dto");
const report_status_validation_pipe_1 = require("./pipes/report-status-validation.pipe");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getReports(filterDto) {
        return this.reportsService.getReports(filterDto);
    }
    getReportById(id) {
        return this.reportsService.getReportById(id);
    }
    deleteReport(id) {
        return this.reportsService.deleteReport(id);
    }
    createReport(createReportDto) {
        return this.reportsService.createReport(createReportDto);
    }
    updateReportStatus(id, status) {
        return this.reportsService.updateReportStatus(id, status);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_report_filter_dto_1.GetReportsFilterDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getReports", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportById", null);
__decorate([
    common_1.Delete('/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteReport", null);
__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createReport", null);
__decorate([
    common_1.Patch('/:id/status'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', report_status_validation_pipe_1.ReportStatusValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateReportStatus", null);
ReportsController = __decorate([
    common_1.Controller('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map