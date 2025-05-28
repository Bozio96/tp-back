import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sells')
export class Sell {
  @PrimaryGeneratedColumn()
  idSell: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  pending: boolean;

  @Column('decimal')
  total: number;
}