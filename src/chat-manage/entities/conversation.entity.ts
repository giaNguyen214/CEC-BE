import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id_mssv' })
  session_id_mssv: string;

  @Column()
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}