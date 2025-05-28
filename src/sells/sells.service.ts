import { Injectable } from '@nestjs/common';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';

@Injectable()
export class SellsService {
  create(createSellDto: CreateSellDto) {
    return 'This action adds a new sell';
  }

  findAll() {
    return `This action returns all sells`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sell`;
  }

  update(id: number, updateSellDto: UpdateSellDto) {
    return `This action updates a #${id} sell`;
  }

  remove(id: number) {
    return `This action removes a #${id} sell`;
  }
}
