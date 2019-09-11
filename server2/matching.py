# Inspired / copied from https://github.com/worldveil/dejavu
from itertools import zip_longest


def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return (filter(None, values) for values in zip_longest(fillvalue=fillvalue, *args))


def find_matches(fingerprints_by_id):
    for id in fingerprints_by_id:
        hashes = fingerprints_by_id[id]

        """
        Return the (song_id, offset_diff) tuples associated with
        a list of (sha1, sample_offset) values.
        """
        # Create a dictionary of hash => offset pairs for later lookups
        mapper = {}
        for hash, offset in hashes:
            mapper[hash.upper()] = offset

        # Get an iteratable of all the hashes we need
        values = mapper.keys()

        for split_values in grouper(values, 1000):
            # Match hashes and return the hash + offset

            for hash, sid, offset in cur:
                # (sid, db_offset - song_sampled_offset)
                yield (sid, offset - mapper[hash])


def align_matches():

    return
