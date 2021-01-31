import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ReportStatus } from '../reports-status.enum';

export class GetReportsFilterDto {
  @IsOptional()
  @IsIn([ReportStatus.PENDING, ReportStatus.APPROVED, ReportStatus.REJECTED])
  status: ReportStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
