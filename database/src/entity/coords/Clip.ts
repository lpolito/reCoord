import { Max, Min } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseAbstract } from '../BaseAbstract';
import { Coord } from './Coord';
import { Video } from './Video';

@Entity()
export class Clip extends BaseAbstract {
  // In seconds, number between -99999.99 and 99999.99
  @Column('decimal', {
    name: 'time_position',
    precision: 7,
    scale: 2,
  })
  @Min(-99999.99)
  @Max(99999.99)
  timePosition: number;

  @ManyToOne(
    () => Coord,
    coord => coord.clips
  )
  coord: Coord;

  @ManyToOne(
    () => Video,
    video => video.clips
  )
  video: Video;
}
