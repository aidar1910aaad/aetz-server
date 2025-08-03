import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Bid } from '../../bids/entities/bid.entity';

export enum UserRole {
  ADMIN = 'admin',
  PTO = 'pto',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PTO,
  })
  role: UserRole;

  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;
}
