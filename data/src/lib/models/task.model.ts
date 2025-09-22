export interface Task
{
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    creator: string;
    assignee: string;
}