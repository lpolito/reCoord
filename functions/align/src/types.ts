// TODO make this common so ui can reference it.

type Hash = string;
type TimeOffset = number;
export type Fingerprint = [Hash, TimeOffset];

export interface Video {
  id: number;
  origin: string;
  originId: string;
  title: string;
  duration: number;
  fingerprints: Fingerprint[];
}
