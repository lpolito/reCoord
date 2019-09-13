# Inspired / copied from https://github.com/worldveil/dejavu
from itertools import zip_longest

import fingerprint


def return_matches(hashes, id_comparing, hashes_to_check):
    hash_map = {}
    for hash, offset in hashes:
        hash_map[hash.upper()] = offset

    for hash, offset in hashes_to_check:
        hash_up = hash.upper()
        if hash_up in hash_map:
            yield (id_comparing, offset - hash_map[hash_up])


def find_matches(fingerprints_by_id):
    matches_by_id = {}

    for id in fingerprints_by_id:
        print(id)
        hashes = fingerprints_by_id[id]
        matches = []

        # Avoid comparing video to itself.
        for id_comparing in filter(lambda x: x != id, fingerprints_by_id):
            hashes_to_check = fingerprints_by_id[id_comparing]

            matches.extend(return_matches(hashes, id_comparing, hashes_to_check))

        # Remove duplicates.
        matches_by_id[id] = matches

    return matches_by_id


def align_matches(matches):
    """
        Finds hash matches that align in time with other matches and finds
        consensus about which hashes are "true" signal from the audio.
        Returns a dictionary with match information.
    """
    # align by diffs
    diff_counter = {}
    largest = 0
    largest_count = 0
    song_id = -1

    for tup in matches:
        sid, diff = tup
        diff = int(diff)

        if diff not in diff_counter:
            diff_counter[diff] = {}
        if sid not in diff_counter[diff]:
            diff_counter[diff][sid] = 0
        diff_counter[diff][sid] += 1

        if diff_counter[diff][sid] > largest_count:
            largest = diff
            largest_count = diff_counter[diff][sid]
            song_id = sid

    nseconds = round(
        float(largest)
        / fingerprint.DEFAULT_FS
        * fingerprint.DEFAULT_WINDOW_SIZE
        * fingerprint.DEFAULT_OVERLAP_RATIO,
        5,
    )

    return {
        "diff_counter": diff_counter,
        "confidence": largest_count,
        "offset": int(largest),
        "offset_seconds": nseconds,
        "match_id": song_id,
    }
