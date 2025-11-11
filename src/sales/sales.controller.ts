import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SalesService } from './sales.service';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('api/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una venta o presupuesto' })
  create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ventas registradas' })
  findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get('next-number')
  @ApiOperation({ summary: 'Obtener la proxima numeracion para la factura' })
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
  @ApiOperation({ summary: 'Obtener una venta por id' })
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(+id);
  }
}
