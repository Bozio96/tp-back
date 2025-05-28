import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ClientsModule } from './clients/clients.module';
import { SellsModule } from './sells/sells.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', //Puede ser 'sqlite', 'postgres', etc.
      database: 'db.mysql', //Puede variar
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //Solo en Dev
    }),
    UsersModule,
    ProductsModule,
    ClientsModule,
    SellsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
