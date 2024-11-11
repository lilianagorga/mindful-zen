import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Interval } from './interval.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  intervalId!: number;

  @ManyToOne(() => Interval, (interval) => interval.goals, {
    onDelete: 'CASCADE',
    eager: true,
  })
  interval!: Interval;
}
