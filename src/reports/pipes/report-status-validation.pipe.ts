import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ReportStatus } from '../reports-status.enum';

export class ReportStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ReportStatus.PENDING,
    ReportStatus.APPROVED,
    ReportStatus.REJECTED,
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
