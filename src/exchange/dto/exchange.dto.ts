import {IsNotEmpty, IsNumber} from 'class-validator';

export class ExchangeDto {
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
