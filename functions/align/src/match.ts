import { Video, Fingerprint } from 'types';

interface MatchesByVideo {
  [key: string]: [string];
}

interface HashMap {
  [key: string]: number;
}

// Tuple of video id, MatchOffsetDiff
type Match = [number, number];

// def prepare_hash_map(hashes) -> Dict[str, int]:
//     # Convert FingerPrintsByFileId to {value: uppercase hash, key: offset} dict
//     hash_map = {}
//     for hash, offset in hashes:
//         hash_map[hash.upper()] = offset

//     return hash_map

const prepareHashMap = (fingerprints: Fingerprint[]): HashMap =>
  fingerprints.reduce(
    (acc, [hash, offset]) => ({
      ...acc,
      [hash.toUpperCase()]: offset,
    }),
    {} as HashMap
  );

// def get_hash_matches(hash_map, hashes_id, hashes_to_check) -> List[Match]:
//     hash_matches: List[Match] = []
//     for hash, offset in hashes_to_check:
//         hash_up = hash.upper()
//         if hash_up in hash_map:
//             hash_matches.append((hashes_id, offset - hash_map[hash_up]))

//     return hash_matches

const getHashMatches = (
  curHashMap: HashMap,
  videoIdToCompare: number,
  fpsToCompare: Fingerprint[]
): Match[] =>
  fpsToCompare.reduce((acc, [hash, offset]) => {
    const hashUp = hash.toUpperCase();

    if (!curHashMap[hashUp]) return acc;

    return [...acc, [videoIdToCompare, offset - curHashMap[hashUp]]];
  }, [] as Match[]);

// def find_matches(fingerprints_by_id) -> MatchesByFileId:
//     matches_by_id: MatchesByFileId = {}

//     for id in fingerprints_by_id:
//         hashes = fingerprints_by_id[id]
//         hash_map = prepare_hash_map(hashes)

//         matches: List[Match] = []

//         # Avoid comparing video to itself.
//         for id_comparing in filter(lambda x: x != id, fingerprints_by_id):
//             hashes_to_check = fingerprints_by_id[id_comparing]

//             matches.extend(get_hash_matches(hash_map, id_comparing, hashes_to_check))

//         matches_by_id[id] = matches

//     return matches_by_id

export const findMatches = (videos: Video[]): MatchesByVideo => {
  const matchesById = {};

  videos.forEach(curVideo => {
    const hashMap = prepareHashMap(curVideo.fingerprints);

    const matches = [];

    videos.forEach(videoToCompare => {
      // Don't compare same videos.
      if (curVideo.id === videoToCompare.id) return;

      matches.push(
        getHashMatches(hashMap, videoToCompare.id, videoToCompare.fingerprints)
      );
    });
  });

  return matchesById;
};
