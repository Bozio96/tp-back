import { Module } from '@nestjs/common';
import { SellsService } from './sells.service';
import { SellsController } from './sells.controller';

@Module({
  controllers: [SellsController],
  providers: [SellsService],
})
export class SellsModule {}
