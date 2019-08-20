import {Writable, WritableOptions} from 'stream';

import {FingerprintBuffer} from './types';

export default class FingerprintBucketer extends Writable {
    public buffer: FingerprintBuffer = {
        tcodes: [],
        hcodes: [],
    };

    public constructor(options?: WritableOptions) {
        super({
            ...options || {},
            objectMode: true,
        });
    }

    public _write: Writable['_write'] = (buffer: FingerprintBuffer, encoding, callback) => {
        this.buffer.tcodes.push(...buffer.tcodes);
        this.buffer.hcodes.push(...buffer.hcodes);

        callback();
    }
}
