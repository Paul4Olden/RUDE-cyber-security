import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CsReportStatus } from '../csreports-status.enum';

export class CsReportStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    CsReportStatus.PENDING,
    CsReportStatus.APPROVED,
    CsReportStatus.REJECTED,
  ];

  transform(value: any /*, metadata: ArgumentMetadata*/) {
    value = value.toUpperCase();
    // console.log('metadata', metadata);
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
