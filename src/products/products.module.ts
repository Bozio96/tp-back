// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PriceChange } from './entities/price-change.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,PriceChange]), // Le dice a TypeORM: "Voy a usar la entidad Product aquí"
  ],
  controllers: [ProductsController],   // Los endpoints (rutas)
  providers: [ProductsService],        //  La lógica de negocio
})
export class ProductsModule {}