import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import Codegen from 'stream-audio-fingerprint';

import {FingerprintBuffer} from './types';
import FingerprintBucketer from './FingerprintBucketer';


export const getYoutubeFingerprint = (url: string) => (
    new Promise<FingerprintBuffer>((resolve, reject) => {
        console.log(`Start: ${url}`);

        const videoStream = ytdl(url, {
            filter: 'audio',
            quality: 'lowestvideo',
        });

        const fingerprinter = new Codegen();
        const bucketer = new FingerprintBucketer();

        ffmpeg(videoStream)
            // Format to what fingerprinter expects.
            .format('wav')
            .withAudioChannels(1)
            .withAudioFrequency(22050)
            .on('error', (err) => {
                console.error(err);

                reject(err);
            })
            .on('end', () => {
                console.log(`End: ${url}`);

                resolve(bucketer.buffer);
            })
            .pipe(fingerprinter)
            .pipe(bucketer);
    })
);
