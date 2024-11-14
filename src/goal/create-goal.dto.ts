import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  intervalId: number;
}
