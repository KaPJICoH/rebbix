import { IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { CurrencyCode } from '../currency-code.enum';

export class ExchangeDto {
  @IsInt()
  @IsNotEmpty()
  @IsEnum(CurrencyCode)
  from: CurrencyCode;

  @IsInt()
  @IsNotEmpty()
  @IsEnum(CurrencyCode)
  to: CurrencyCode;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
