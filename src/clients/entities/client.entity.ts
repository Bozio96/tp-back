import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  idClient: number;

  @Column()
  customerCode: string;

  @Column()
  forstNameClient: string;

  @Column()
  lastNameClient: string;

  @Column()
  province: string;

  @Column()
  locality: string;

  @Column()
  cp: string;

  @Column()
  address: string;
}