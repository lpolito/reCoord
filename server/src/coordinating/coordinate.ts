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


export const syncByBuckets = () => (
    new Promise(async (resolve, reject) => {
        const fpDatas: FingerprintData[] = [
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

                const {
                    id: idToCheck,
                    buffer: {
                        tcodes: tcodesToCheck,
                        hcodes: hcodesToCheck,
                    },
                } = fpDataToCheck;

                const matchingTCodes: number[] = [];
                const matchingHCodes: number[] = [];

                tcodesToCheck.forEach((t, i) => {
                    const hcodeToCheck = hcodesToCheck[i];

                    // Get all matching indices of hcodes.
                    const matchIndices: number[] = [];
                    let x = curHCodes.indexOf(hcodeToCheck);
                    while (x !== -1) {
                        matchIndices.push(x);
                        x = curHCodes.indexOf(hcodeToCheck, x + 1);
                    }

                    // No matches.
                    if (matchIndices.length === 0) return;

                    // const matchingTCodes: number[] = [];
                    matchIndices.forEach((index) => {
                        matchingTCodes.push(curTCodes[index]);
                        matchingHCodes.push(curHCodes[index]);
                    });
                });

                console.log({
                    curId,
                    idToCheck,
                    matchingTCodes,
                    matchingHCodes,
                });
            });
        });

        resolve({});
    })
);
