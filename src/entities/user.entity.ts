import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Interval } from './interval.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToMany(() => Interval, (interval) => interval.user)
  intervals!: Interval[];
}
