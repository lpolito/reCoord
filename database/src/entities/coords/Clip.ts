import { Max, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseAbstract } from '../BaseAbstract';
import { COORDS } from '../db-schemas';
import { Coord } from './Coord';
import { Video } from './Video';

@Entity({ schema: COORDS })
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
  @JoinColumn({ name: 'coord_id' })
  coord: Coord;

  @ManyToOne(
    () => Video,
    video => video.clips
  )
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
