import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  idProduct: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column('int')
  stock: number;

  @Column('decimal')
  price: number;
}