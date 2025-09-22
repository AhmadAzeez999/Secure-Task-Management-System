import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Task
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    creator: string;

    @Column()
    assignee: string;

    @ManyToOne(() => User, user => user.tasks)
    owner: User;
}
