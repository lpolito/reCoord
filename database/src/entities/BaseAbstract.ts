import { IsNotEmpty, ValidateIf } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseAbstract {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ name: 'deleted_at', nullable: true, default: null })
  @ValidateIf(o => o.deleted)
  @IsNotEmpty()
  deletedAt: Date;
}
