import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserType } from '../enums/user-type.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column()
  nomUser: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.COMMON
  })
  userType: UserType;
}