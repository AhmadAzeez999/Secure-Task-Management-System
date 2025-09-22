import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(() => Task, task => task.owner)
    tasks: Task[];
}
