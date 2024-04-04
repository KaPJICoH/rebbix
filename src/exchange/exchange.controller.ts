import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExchangerService } from './exchanger.service';
import { ExchangeDto } from './dto/exchange.dto';
import { SuccessResponse } from '../dto/success.response';

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangerService: ExchangerService) {}

  @Post('/')
  public async exchange(
    @Body() exchangeDto: ExchangeDto,
  ): Promise<SuccessResponse<any>> {
    const value = await this.exchangerService.exchange(
      exchangeDto.from,
      exchangeDto.to,
      exchangeDto.amount,
    );

    return new SuccessResponse<any>({ value: value });
  }
}
