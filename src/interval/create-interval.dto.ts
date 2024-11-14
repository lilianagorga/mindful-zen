import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateIntervalDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  userId: number;
}
