import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { Client } from '../clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail, Product, Client])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
