import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../entities/common';

@Entity()
export class AuditLog extends BaseEntity {
  @Column()
  action: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  userId: string;

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

  @Column({
    default: '',
  })
  ip: string;
}
