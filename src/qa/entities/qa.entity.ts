import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('question')
export class Qa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mssv: string;

  @Column({ name: 'question' })
  question: string;

  @Column({ name: 'answer' })
  answer: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}