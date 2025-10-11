import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';

@Controller('api/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get('next-number')
  getNextInvoiceNumber(
    @Query('type') type: string = 'sale',
    @Query('invoiceType') invoiceType?: string,
  ): Promise<{
    pointOfSale: string;
    invoiceNumber: string;
    invoiceType: string;
  }> {
    if (type !== 'sale' && type !== 'quote') {
      throw new BadRequestException(
        `Tipo invalido "${type}". Los valores permitidos son sale o quote.`,
      );
    }
    return this.salesService.previewNextInvoiceIdentifiers(
      type as 'sale' | 'quote',
      invoiceType,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(+id);
  }
}
