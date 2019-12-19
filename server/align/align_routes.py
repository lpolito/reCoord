import operator
from collections import Counter
from os import path
from typing import Dict, List

from flask import Blueprint
from flask import current_app as APP
from flask import jsonify, request
from scipy.io import wavfile

from utils.Timer import Timer
from utils.utils import get_dir_contents

from .convert import convert_directory_to_wav
from .download import download_by_ytids
from .lib.fingerprint import fingerprint
from .matching import align_matches, find_matches
from .types import Align, FileId, Fingerprint, FingerprintsByFileId

# Blueprint for route
align_bp = Blueprint("align_bp", __name__)


def fingerprint_directory(wav_location) -> FingerprintsByFileId:
    fingerprints_by_id: FingerprintsByFileId = {}

    output_wavs = get_dir_contents(wav_location)

    for wav_file in output_wavs:
        file_id: FileId = path.splitext(wav_file)[0]

        wav_file_path = path.join(wav_location, wav_file)

        APP.logger.info("Wav to fingerprint: " + wav_file_path)
        buffer: List[int]
        _, buffer = wavfile.read(wav_file_path)

        # Generate fingerprint (convert generator to complete list of hashes).
        hashes: List[Fingerprint] = list(fingerprint(buffer))

        fingerprints_by_id[file_id] = hashes

    return fingerprints_by_id


def get_base_clip(aligns_by_id):
    # Get the base clip (the clip for which most others are offset to)
    # This is needed for a baseline of how all the clips relate to each other and is somewhat arbitrary.
    match_frequency = Counter(
        aligns_by_id[k]["match_id"] for k in aligns_by_id if aligns_by_id[k]["match_id"]
    )

    # Get id with most occurences.
    return max(match_frequency.items(), key=operator.itemgetter(1))[0]


def calculate_clips(aligns_by_id):
    clips = []

    base_clip = get_base_clip(aligns_by_id)

    return aligns_by_id


@align_bp.route("/", methods=["POST"])
def align_youtube_videos():
    req_data = request.get_json()
    yt_vids = req_data["ytVids"]

    APP.logger.info("Videos to fingerprint: " + str(yt_vids))

    # Download videos.
    download_timer = Timer().start()
    download_location = download_by_ytids(yt_vids)
    download_timer.end()

    # Convert all videos to same wav format.
    wav_conversion_timer = Timer().start()
    wav_location = convert_directory_to_wav(download_location)
    wav_conversion_timer.end()

    # Fingerprint wav files.
    fingerprint_timer = Timer().start()
    fingerprints_by_id = fingerprint_directory(wav_location)
    fingerprint_timer.end()

    # Compare generated fingerprints and produce offset data.
    matches_by_id = find_matches(fingerprints_by_id)

    # Given offset data, find where fingerprints are the same across videos and provide match metadata.
    aligns_by_id: Dict[FileId, Align] = {}
    for matches_id in matches_by_id:
        aligns_by_id[matches_id] = align_matches(matches_by_id[matches_id])

    # Coerce match metadata into clips.
    clips = calculate_clips(aligns_by_id)

    response = {
        "clips": clips,
        "download_time_total": download_timer.get_diff_seconds(),
        "wav_conversion_time_total": wav_conversion_timer.get_diff_seconds(),
        "fingerprint_time_total": fingerprint_timer.get_diff_seconds(),
    }

    return jsonify(response)
