import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../entities/common';

@Entity()
export class AuditLog extends CommonEntity {
  @Column()
  action: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'json', nullable: true })
  content: Record<string, unknown>;

  @Column({
    default: '',
  })
  url: string;
}
