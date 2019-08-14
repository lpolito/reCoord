export interface FingerprintBuffer {
    tcodes: number[];
    hcodes: number[];
}

export interface FingerprintBuckets {
    [tcodes: string]: number[];
}
