import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExchangerService } from './exchanger.service';
import { ExchangeDto } from './dto/exchange.dto';

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangerService: ExchangerService) {}

  @Post('/')
  public async exchange(@Body() exchangeDto: ExchangeDto): Promise<number> {
    //@todo response and validation
    return this.exchangerService.exchange(
      exchangeDto.from,
      exchangeDto.to,
      exchangeDto.amount,
    );
  }
}
