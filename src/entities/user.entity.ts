import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Interval } from './interval.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: 'user' })
  role!: string;

  @OneToMany(() => Interval, (interval) => interval.user)
  intervals!: Interval[];
}
