// import {readJson} from 'fs-extra';

import {FingerprintBuffer} from '../fingerprinting/types';

import buffer1 from '../examples/1-wav-buffer.json';
import buffer2 from '../examples/2-wav-buffer.json';
import buffer3 from '../examples/3-wav-buffer.json';


interface FingerprintData {
    id: number;
    buffer: FingerprintBuffer;
    duration: number;
}

const zip = (a: any[], b: any[]) => (
    a.map((e, i) => [e, b[i]])
);


const returnMatches = (hashes: number[][], idComparing: string, hashesToCheck: number[][]) => {
    const results: number[][] = [];
    const hashMap: {[key: number]: number} = {};

    hashes.forEach(([hash, offset]) => {
        hashMap[hash] = offset;
    });

    hashesToCheck.forEach(([hash, offset]) => {
        if (hashMap[hash]) {
            results.push([Number.parseInt(idComparing, 10), offset - hashMap[hash]]);
        }
    });

    return results;
};

const findMatches = (fingerprintsById: any) => {
    const matchesById: any = {};

    Object.keys(fingerprintsById).forEach((id) => {
        const hashes = fingerprintsById[id];

        // Avoid comparing video to itself.
        Object.keys(fingerprintsById).forEach((idComparing) => {
            if (idComparing === id) return;

            const hashesToCheck = fingerprintsById[idComparing];
            matchesById[id] = returnMatches(hashes, idComparing, hashesToCheck);
        });
    });

    return matchesById;
};

const alignMatches = (matches: any) => {
    const diffCounter: {[key: number]: any} = {};
    let largest = 0;
    let largestCount = 0;
    let matchId = -1;

    matches.forEach((tup: number[]) => {
        const [sid, diff] = tup;

        if (!diffCounter[diff]) {
            diffCounter[diff] = {};
        }

        if (!diffCounter[diff][sid]) {
            diffCounter[diff][sid] = 0;
        }

        diffCounter[diff][sid] += 1;

        if (diffCounter[diff][sid] > largestCount) {
            largest = diff;
            largestCount = diffCounter[diff][sid];
            matchId = sid;
        }
    });

    const FFT = 512;
    const STEP = FFT / 2;
    const DT = 1 / (22050 / STEP);

    const nseconds = (DT * largest) / 1000;

    return {
        diffCounter,
        confidence: largestCount,
        offset: largest,
        offsetSeconds: nseconds,
        matchId,
    };
};


export const syncByBuckets = () => (
    new Promise(async (resolve, reject) => {
        const foo: any = {
            1: zip(buffer1.hcodes, buffer1.tcodes),
            2: zip(buffer2.hcodes, buffer2.tcodes),
            3: zip(buffer3.hcodes, buffer3.tcodes),
        };

        const matchesById = findMatches(foo);

        const result: any = {};
        Object.keys(matchesById).forEach((id) => {
            result[id] = alignMatches(matchesById[id]);
        });

        resolve(result);
    })
);
