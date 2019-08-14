import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import Codegen from 'stream-audio-fingerprint';

import {FingerprintBuckets} from './types';
import FingerprintBucketer from './FingerprintBucketer';


export const getYoutubeFingerprint = (url: string) => (
    new Promise<FingerprintBuckets>((resolve, reject) => {
        console.log(`Start: ${url}`);

        const videoStream = ytdl(url, {
            filter: 'audio',
            quality: 'lowestvideo',
        });

        const fingerprinter = new Codegen();
        const bucketer = new FingerprintBucketer();

        ffmpeg(videoStream)
            // Ignore video output.
            .withNoVideo()
            .format('mp3')
            .on('error', (err) => {
                console.error(err);

                reject(err);
            })
            .on('end', () => {
                console.log(`End: ${url}`);

                resolve(bucketer.fingerBuckets);
            })
            .pipe(fingerprinter)
            .pipe(bucketer);
    })
);
