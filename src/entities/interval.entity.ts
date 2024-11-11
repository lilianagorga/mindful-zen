import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Goal } from './goal.entity';

@Entity('intervals')
export class Interval {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.intervals, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Goal, (goal) => goal.interval)
  goals!: Goal[];
}
