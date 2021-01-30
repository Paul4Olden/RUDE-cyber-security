"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatusValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const reports_status_enum_1 = require("../reports-status.enum");
class ReportStatusValidationPipe {
    constructor() {
        this.allowedStatuses = [
            reports_status_enum_1.ReportStatus.PENDING,
            reports_status_enum_1.ReportStatus.APPROVED,
            reports_status_enum_1.ReportStatus.REJECTED,
        ];
    }
    transform(value) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new common_1.BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }
    isStatusValid(status) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
exports.ReportStatusValidationPipe = ReportStatusValidationPipe;
//# sourceMappingURL=report-status-validation.pipe.js.map