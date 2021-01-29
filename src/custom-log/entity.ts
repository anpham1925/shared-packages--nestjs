import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../entities/common';

@Entity()
export class Log extends CommonEntity {
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
