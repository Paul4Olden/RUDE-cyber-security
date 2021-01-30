import { PipeTransform } from '@nestjs/common';
import { ReportStatus } from '../reports-status.enum';
export declare class ReportStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses: ReportStatus[];
    transform(value: any): any;
    private isStatusValid;
}
