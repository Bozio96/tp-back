import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SaleDetail } from 'src/sales/entities/sale-detail.entity';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail, Product, Client])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
