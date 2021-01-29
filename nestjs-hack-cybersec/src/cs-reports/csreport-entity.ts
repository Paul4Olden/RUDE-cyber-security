import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CsReportStatus } from './csreports-status.enum';

@Entity()
export class CsReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: CsReportStatus;
}
