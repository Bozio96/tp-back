import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Department } from 'src/departments/entities/department.entity';
import { PriceChange } from './price-change.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50, unique: true, nullable: false })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ name: 'min_stock', type: 'int', default: 0 })
  minStock: number;

  @Column({ name: 'cost_base', type: 'decimal', precision: 10, scale: 2 })
  costBase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discounts: number;

  @Column({ name: 'include_iva', type: 'boolean', default: false })
  includeIVA: boolean;

  @Column({
    name: 'utility_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  utilityPercentage: number;

  @Column({ name: 'sale_price', type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Department, (department) => department.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PriceChange, (priceChange) => priceChange.product)
  priceChanges: PriceChange[];
}
