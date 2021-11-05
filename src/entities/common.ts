import {
  Any,
  CreateDateColumn,
  IsNull,
  Not,
  ObjectID,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

export abstract class BaseEntityMongoDB {
  @ObjectIdColumn()
  id: ObjectID;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

export const IsNotNull = () => Not(IsNull());

export const CustomAny = () => Any([IsNotNull(), IsNull()]);
