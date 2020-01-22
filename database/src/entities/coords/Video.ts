import { Length, Max, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseAbstract } from '../BaseAbstract';
import { COORDS } from '../db-schemas';
import { Clip } from './Clip';
import { Fingerprint } from './Fingerprint';

export enum VideoOrigin {
  YOUTUBE = 'youtube',
}

@Entity({ schema: COORDS })
export class Video extends BaseAbstract {
  @Column('enum', {
    enum: VideoOrigin,
    default: VideoOrigin.YOUTUBE,
  })
  origin: VideoOrigin;

  @Column('varchar')
  @Length(0, 100)
  title: string;

  // In seconds, number up to 99999.99
  @Column('decimal', {
    precision: 7,
    scale: 2,
  })
  @Min(0)
  @Max(99999.99)
  duration: number;

  @Column('varchar', { name: 'origin_id' })
  originId: string;

  @OneToMany(
    () => Clip,
    clip => clip.video
  )
  clips: Clip[];

  @OneToMany(
    () => Fingerprint,
    fingerprint => fingerprint.video
  )
  fingerprints: Fingerprint[];
}
