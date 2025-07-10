import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('n8n_chat_histories')
export class N8nChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_id: string;

  @Column('json')
  message: any;
}
