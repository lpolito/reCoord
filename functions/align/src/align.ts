// def align_matches(matches: List[Match]) -> Align:
//     """
//     Finds hash matches that align in time with other matches and finds
//     consensus about which hashes are "true" signal from the audio.
//     Returns a dictionary with match information.
//     """
//     # align by diffs
//     diff_counter = {}
//     largest = 0
//     largest_count = 0
//     match_id = -1

//     for match in matches:
//         sid, diff = match
//         diff = int(diff)

//         if diff not in diff_counter:
//             diff_counter[diff] = {}
//         if sid not in diff_counter[diff]:
//             diff_counter[diff][sid] = 0
//         diff_counter[diff][sid] += 1

//         if diff_counter[diff][sid] > largest_count:
//             largest = diff
//             largest_count = diff_counter[diff][sid]
//             match_id = sid

//     nseconds = round(
//         float(largest) / DEFAULT_FS * DEFAULT_WINDOW_SIZE * DEFAULT_OVERLAP_RATIO, 5
//     )

//     return {
//         # "diff_counter": diff_counter,
//         "confidence": largest_count,
//         # "offset": int(largest),
//         "offset_seconds": nseconds,
//         "match_id": match_id,
//     }
