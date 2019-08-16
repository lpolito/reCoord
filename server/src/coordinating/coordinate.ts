// import {readJson} from 'fs-extra';

import {FingerprintBuffer} from '../fingerprinting/types';

import buffer1 from '../examples/1-buffer.json';
import buffer2 from '../examples/2-buffer.json';
import buffer3 from '../examples/3-buffer.json';


// TEMP
const SAMPLING_RATE = 22050;
const BPS = 2;
const MNLM = 5;
const MPPP = 3;
const NFFT = 512;
const STEP = NFFT / 2; // 50 % overlap
const DT = 1 / (SAMPLING_RATE / STEP);

interface FingerprintData {
    id: number;
    buffer: FingerprintBuffer;
}

const toFixed = (num: number, digits: number) => (
    // eslint-disable-next-line no-restricted-properties
    Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)
);


export const syncByBuckets = () => (
    new Promise(async (resolve, reject) => {
        // const fpDatas: FingerprintData[] = await Promise.all([
        //     readJson('../src/examples/1-buffer.json'),
        //     readJson('../src/examples/2-buffer.json'),
        //     readJson('../src/examples/3-buffer.json'),
        // ])
        //     // For now just give the finger print an id based on the index. Will need to match the internal video id.
        //     .then((bucketss) => bucketss.map((buffer, index) => ({
        //         id: index,
        //         buffer,
        //     })));

        const fpDatas = [
            {
                id: 1,
                buffer: buffer1,
                duration: 194,
            },
            {
                id: 2,
                buffer: buffer2,
                duration: 159,
            },
            {
                id: 3,
                buffer: buffer3,
                duration: 22,
            },
        ];

        interface DiffCounter {
            [key: number]: {
                [key: number]: {
                    count: number;
                    resfingers: number[];
                };
            };
        }

        type MaxDiff = number | null;
        type MaxId = number | null;
        type LargestCount = number;
        interface Output {
            [id: number]: {
                diffCounter: DiffCounter;
                maxDiff: MaxDiff;
                maxId: MaxId;
                largestCount: LargestCount;
            };
        }

        const output: Output = {};

        fpDatas.forEach((curFpData) => {
            const {
                id: curId,
                buffer: {
                    tcodes: curTCodes,
                    hcodes: curHCodes,
                },
            } = curFpData;

            fpDatas.forEach((fpDataToCheck) => {
                // Skip over the current fingerprint data.
                if (curId === fpDataToCheck.id) return;

                // we count the fingerprints that match for each dt interval.
                // tcodes[0] and res[0].dt are arbitrary constants.
                // diffCounter is a compilation of the results.
                // it stores, for each matching fingerprint, the alignment in time
                // and the file in database related to this fingerprint.
                // at the end, we select the file that had the most matching fingerprints at
                // a given alignment in time.
                // res[i] === fpfpDataToCheck
                const {
                    buffer: {
                        tcodes: tcodesToCheck,
                        hcodes: hcodesToCheck,
                    },
                } = fpDataToCheck;

                const diffCounter: DiffCounter = {};
                let maxDiff: MaxDiff = null;
                let maxId: MaxId = null;
                let largestCount: LargestCount = 0;

                tcodesToCheck.forEach((tcodeToCheck, i) => {
                    const curHCodeMatchIndex = curHCodes.indexOf(hcodesToCheck[i]);

                    // No matching index therefore no match, bail out.
                    if (curHCodeMatchIndex === -1) return;

                    const deltaMeasure = curTCodes[curHCodeMatchIndex] - curTCodes[0];
                    const deltaRef = tcodeToCheck - tcodesToCheck[0];
                    const diff = deltaRef - deltaMeasure;

                    if (!diffCounter[diff]) {
                        diffCounter[diff] = {};
                    }

                    if (!diffCounter[diff][fpDataToCheck.id]) {
                        diffCounter[diff][fpDataToCheck.id] = {count: 1, resfingers: [i]};
                    } else {
                        diffCounter[diff][fpDataToCheck.id].count += 1;
                        diffCounter[diff][fpDataToCheck.id].resfingers.push(i);
                    }

                    if (diffCounter[diff][fpDataToCheck.id].count > largestCount) {
                        largestCount = diffCounter[diff][fpDataToCheck.id].count;
                        maxId = fpDataToCheck.id;
                        maxDiff = diff;
                    }
                });

                if (maxDiff === null || maxId === null) {
                    reject(new Error('No matches'));
                    return;
                }

                // compute the average position and standard deviation for the
                // group of fingerprints that lead to a match
                const o = diffCounter[maxDiff][maxId];
                let avg = 0;
                let std = 0;

                o.resfingers.forEach((resFinger) => {
                    const tCodeAtResFinger = tcodesToCheck[resFinger];
                    avg += tcodesToCheck[resFinger];
                    std += (tCodeAtResFinger - avg) ** 2;
                });

                avg /= o.resfingers.length;
                avg = Math.round(avg * DT * 100) / 100;

                std = Math.sqrt(std) / o.resfingers.length;
                std = Math.round(std * DT * 100) / 100;

                // get info about detected reference file
                const trackInfo = fpDatas.find(({id}) => id === maxId);
                let durationRef = 0;
                let fingersCountRef = 0;

                if (trackInfo) {
                    durationRef = trackInfo.duration;
                    fingersCountRef = trackInfo.buffer.hcodes.length;
                }

                // confidence factors
                // how many of the fingerprints in the reference track have we detected here?
                const ratioFingersReference = largestCount / fingersCountRef;
                // how many of the fingerprints in the measurements have contributed to the detection?
                const ratioFingersMeasurements = largestCount / curTCodes.length;
                // are fingerprints detections focused in time in the reference track? (<<1 = yes; ~1 = no)
                const matchingFocus = std ? durationRef / std : 0;

                // empirical threshold above which detections have been found to be reliable
                const targetConfidence1 = 0.01;
                // empirical threshold above which detections have been found to be reliable
                const targetConfidence2 = 0.02;

                // f(x) ~ x near zero, then converges to 1. actFun(1) = 1 - e^-1 ~ 0.63
                const activationFun = (x: number) => (1 - Math.exp(-x));
                const confidence1 = activationFun(ratioFingersReference * ratioFingersMeasurements / targetConfidence1);
                const confidence2 = activationFun(
                    ratioFingersReference * ratioFingersMeasurements * matchingFocus / targetConfidence2
                );

                // // softmax vector, similar to that of ML module.
                // const softmax = new Array(4);
                // for (let i = 0; i < 4; i++) {
                //     if (i === maxClass) {
                //         softmax[i] = 1 / 4 + 3 / 4 * confidence2;
                //     } else {
                //         softmax[i] = 1 / 4 - 1 / 4 * confidence2;
                //     }
                // }


                console.log({
                    curId,
                    // diffCounter,
                    maxDiff,
                    maxId,
                    largestCount,

                    durationRef, // duration (in seconds)
                    fingersCountRef, // total amount of fingerprints

                    // info about matching fingerprints
                    matchesSync: largestCount, // amount of fingerprints matched, with a given time alignment
                    tRefAvg: avg, // average position of fingerprints in the reference file (in seconds)
                    tRefStd: std, // standard deviation of position of fingerprints in the ref file (in seconds)

                    // info about measurements
                    fingersCountMeasurements: curTCodes.length, // amount of fingerprints generated by measurements

                    // confidence factors
                    ratioFingersReference: toFixed(ratioFingersReference, 5),
                    ratioFingersMeasurements: toFixed(ratioFingersMeasurements, 5),
                    matchingFocus: toFixed(matchingFocus, 5),
                    confidence1: toFixed(confidence1, 5),
                    confidence2: toFixed(confidence2, 5),
                    // softmaxraw: softmax,
                });
            });
        });


        resolve(output);
    })
);
