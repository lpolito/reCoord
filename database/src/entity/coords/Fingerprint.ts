import { Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Video } from './Video';

export enum VideoOrigin {
  YOUTUBE = 'youtube',
}

@Entity()
export class Fingerprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  hash: string;

  // In seconds, number up to 99999.99
  @Column('decimal', {
    name: 'time_offset',
    precision: 7,
    scale: 2,
  })
  @Min(0)
  @Max(99999.99)
  timeOffset: number;

  @ManyToOne(
    () => Video,
    video => video.fingerprints
  )
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
