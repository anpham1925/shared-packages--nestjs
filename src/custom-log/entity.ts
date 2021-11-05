import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../entities/common';

@Entity()
export class Log extends BaseEntity {
  @Column({
    nullable: true,
  })
  general: string;

  @Column({
    nullable: true,
  })
  detail: string;

  @Column({
    nullable: true,
  })
  generatedBy: number;

  @Column({
    default: '',
  })
  url: string;
}
