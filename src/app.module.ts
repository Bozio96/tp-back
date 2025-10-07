import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ClientsModule } from './clients/clients.module';
import { DepartmentsModule } from './departments/departments.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    SuppliersModule,
    DepartmentsModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}