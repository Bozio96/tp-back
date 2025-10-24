import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  dni: string | null;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  cuil: string | null;


  @Column({ name: 'telefono', type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  domicilio: string;
}
