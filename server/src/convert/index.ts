import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import Codegen from 'stream-audio-fingerprint';


interface FingerprintBuffer {
    tcodes: number[];
    hcodes: number[];
}

interface FingerprintBuckets {
    [tcodes: string]: number[];
}


export const convertYoutubeById = (url: string) => (
    new Promise((resolve, reject) => {
        const videoStream = ytdl(url, {
            filter: 'audio',
            quality: 'lowestvideo',
        });

        // videoStream.on('progress', (c, downloaded, total) => {
        //     const progress = Math.floor((downloaded / total) * 100);
        //     console.log(`Progress: ${progress}%\r`);
        // });

        const fingerprinter = new Codegen();

        const fingerbuffer: FingerprintBuffer = {
            tcodes: [],
            hcodes: [],
        };

        fingerprinter.on('data', ({tcodes, hcodes}: FingerprintBuffer) => {
            fingerbuffer.tcodes.push(...tcodes);
            fingerbuffer.hcodes.push(...hcodes);
        });

        ffmpeg()
            .input(videoStream)
            // Ignore video output.
            .withNoVideo()
            .format('mp3')
            .on('error', (err) => {
                console.error(err);
                reject(err);
            })
            .on('end', () => {
                console.log('done processing input stream');

                // Take all matching time codes (tcodes) and bucket the hcodes with them.
                // Do not destructure fingerbuffer because it's significantly faster.
                const buckets = fingerbuffer.tcodes.reduce((acc: FingerprintBuckets, tcode, index) => {
                    const existingBucket = acc[tcode] || [];

                    return {
                        ...acc,
                        [tcode]: [...existingBucket, fingerbuffer.hcodes[index]],
                    };
                }, {});

                // const uniqueTCodes = new Set(fingerbuffer.tcodes).size;
                // console.log({uniqueTCodes});

                // console.log({numOfBuckets: Object.keys(buckets).length});

                resolve(buckets);
            })
            .pipe(fingerprinter);
    })
);
