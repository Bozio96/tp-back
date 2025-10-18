import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { SaleDetail } from './sale-detail.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'point_of_sale',
    type: 'varchar',
    length: 4,
    default: '0001',
  })
  pointOfSale: string;

  @Column({ name: 'invoice_number', type: 'varchar', length: 20, nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'invoice_type', type: 'varchar', length: 2 })
  invoiceType: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 30, nullable: true })
  paymentMethod: string | null;

  @Column({ name: 'customer_type', type: 'varchar', length: 30 })
  customerType: string;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @ManyToOne(() => Client, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'client_id' })
  client?: Client | null;

  @RelationId((sale: Sale) => sale.client)
  clientId?: number | null;

  @Column({ name: 'total_net', type: 'decimal', precision: 12, scale: 2 })
  totalNet: number;

  @Column({ name: 'total_iva', type: 'decimal', precision: 12, scale: 2 })
  totalIva: number;

  @Column({ name: 'total_discount', type: 'decimal', precision: 12, scale: 2 })
  totalDiscount: number;

  @Column({ name: 'total_final', type: 'decimal', precision: 12, scale: 2 })
  totalFinal: number;

  @Column({ name: 'tipo', type: 'varchar', length: 20, default: 'venta' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SaleDetail, (detail) => detail.sale, {
    cascade: true,
  })
  details: SaleDetail[];
}
