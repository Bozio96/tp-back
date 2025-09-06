import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255, unique: true, nullable: false })
  name: string;

  @OneToMany(() => Product, product => product.supplier)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}