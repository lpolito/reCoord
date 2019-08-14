import {Writable, WritableOptions} from 'stream';

import {
    FingerprintBuckets,
    FingerprintBuffer,
} from './types';

export default class FingerprintBucketer extends Writable {
    public fingerBuckets: FingerprintBuckets = {};

    public constructor(options?: WritableOptions) {
        super({
            ...options || {},
            objectMode: true,
        });
    }

    public _write: Writable['_write'] = (buffer: FingerprintBuffer, encoding, callback) => {
        // Take all matching time codes (tcodes) and bucket the corresponding hcodes with them.
        buffer.tcodes.forEach((tcode, index) => {
            const existingBucket = this.fingerBuckets[tcode] || [];

            this.fingerBuckets[tcode] = [...existingBucket, buffer.hcodes[index]];
        });

        callback();
    }
}
