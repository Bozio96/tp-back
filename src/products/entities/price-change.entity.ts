import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('price_changes')
export class PriceChange {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Product, (product) => product.priceChanges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'old_price', type: 'decimal', precision: 10, scale: 2 })
  oldPrice: number;

  @Column({ name: 'new_price', type: 'decimal', precision: 10, scale: 2 })
  newPrice: number;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
