import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CsReportStatus } from '../csreports-status.enum';

export class GetCsReportsFilterDto {
  @IsOptional()
  @IsIn([
    CsReportStatus.PENDING,
    CsReportStatus.APPROVED,
    CsReportStatus.REJECTED,
  ])
  status: CsReportStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
