import { BaseEntity } from 'typeorm';
import { ReportStatus } from './reports-status.enum';
export declare class Report extends BaseEntity {
    id: number;
    title: string;
    description: string;
    status: ReportStatus;
}
