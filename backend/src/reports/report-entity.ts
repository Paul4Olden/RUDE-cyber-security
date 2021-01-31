import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReportStatus } from './reports-status.enum';

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ReportStatus;
}
