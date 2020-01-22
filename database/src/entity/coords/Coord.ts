import { Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseAbstract } from '../BaseAbstract';
import { Clip } from './Clip';

@Entity()
export class Coord extends BaseAbstract {
  @Column('varchar')
  @Length(0, 100)
  title: string;

  @Column('text')
  @Length(0, 400)
  description: string;

  @OneToMany(
    () => Clip,
    clip => clip.coord
  )
  clips: Clip[];
}
