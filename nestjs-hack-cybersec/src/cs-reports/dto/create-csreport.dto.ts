import { IsNotEmpty } from 'class-validator';

export class CreateCsReportDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
