import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('private_database')
export class PrivateDatabase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    hash: string;

    @Column({ name: 'mssv' })
    mssv: string;

    @Column()
    type:string;

    @Column({ name: 'status', nullable: false })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
