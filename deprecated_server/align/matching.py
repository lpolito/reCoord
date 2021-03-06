# Inspired / copied from https://github.com/worldveil/dejavu
from typing import Generator, Dict, List
from align.types import Match, MatchesByFileId, Align

from align.lib.fingerprint import DEFAULT_FS, DEFAULT_OVERLAP_RATIO, DEFAULT_WINDOW_SIZE


def prepare_hash_map(hashes) -> Dict[str, int]:
    # Convert FingerPrintsByFileId to {value: uppercase hash, key: offset} dict
    hash_map = {}
    for hash, offset in hashes:
        hash_map[hash.upper()] = offset

    return hash_map


def get_hash_matches(hash_map, hashes_id, hashes_to_check) -> List[Match]:
    hash_matches: List[Match] = []
    for hash, offset in hashes_to_check:
        hash_up = hash.upper()
        if hash_up in hash_map:
            hash_matches.append((hashes_id, offset - hash_map[hash_up]))

    return hash_matches


def find_matches(fingerprints_by_id) -> MatchesByFileId:
    matches_by_id: MatchesByFileId = {}

    for id in fingerprints_by_id:
        hashes = fingerprints_by_id[id]
        hash_map = prepare_hash_map(hashes)

        matches: List[Match] = []

        # Avoid comparing video to itself.
        for id_comparing in filter(lambda x: x != id, fingerprints_by_id):
            hashes_to_check = fingerprints_by_id[id_comparing]

            matches.extend(get_hash_matches(hash_map, id_comparing, hashes_to_check))

        matches_by_id[id] = matches

    return matches_by_id


def align_matches(matches: List[Match]) -> Align:
    """
    Finds hash matches that align in time with other matches and finds
    consensus about which hashes are "true" signal from the audio.
    Returns a dictionary with match information.
    """
    # align by diffs
    diff_counter = {}
    largest = 0
    largest_count = 0
    match_id = -1

    for match in matches:
        sid, diff = match
        diff = int(diff)

        if diff not in diff_counter:
            diff_counter[diff] = {}
        if sid not in diff_counter[diff]:
            diff_counter[diff][sid] = 0
        diff_counter[diff][sid] += 1

        if diff_counter[diff][sid] > largest_count:
            largest = diff
            largest_count = diff_counter[diff][sid]
            match_id = sid

    nseconds = round(
        float(largest) / DEFAULT_FS * DEFAULT_WINDOW_SIZE * DEFAULT_OVERLAP_RATIO, 5
    )

    return {
        # "diff_counter": diff_counter,
        "confidence": largest_count,
        # "offset": int(largest),
        "offset_seconds": nseconds,
        "match_id": match_id,
    }
