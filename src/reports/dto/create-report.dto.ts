import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
