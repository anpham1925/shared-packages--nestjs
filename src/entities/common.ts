import {
  Any,
  CreateDateColumn,
  IsNull,
  Not,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

export const IsNotNull = () => Not(IsNull());

export const CustomAny = () => Any([IsNotNull(), IsNull()]);
