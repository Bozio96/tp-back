// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { Department } from './departments/entities/department.entity';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ProductsModule,
    BrandsModule,
    Department,
    CategoriesModule,
    SuppliersModule,
    DepartmentsModule,
  ],
})
export class AppModule {}