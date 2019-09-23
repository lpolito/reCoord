from os import path

from flask import Flask, jsonify, request
from flask.logging import create_logger
from scipy.io import wavfile

from convert import convert_directory_to_wav
from download import download_by_ytids
from fingerprint import fingerprint
from matching import align_matches, find_matches
from utils import get_dir_contents

app = Flask(__name__)
app.config.from_object("default_config")


def fingerprint_directory(wav_location):
    fingerprints_by_id = {}

    output_wavs = get_dir_contents(wav_location)

    for wav_file in output_wavs:
        file_id = path.splitext(wav_file)[0]

        wav_file_path = path.join(wav_location, wav_file)

        app.logger.info("Wav to fingerprint: " + wav_file_path)
        _, buffer = wavfile.read(wav_file_path)

        # Generate fingerprint (convert generator to complete list of hashes).
        hashes = list(fingerprint(buffer))

        fingerprints_by_id[file_id] = hashes

    return fingerprints_by_id


@app.route("/", methods=["POST"])
def align_youtube_videos():
    req_data = request.get_json()
    yt_vids = req_data["ytVids"]

    app.logger.info("Videos to fingerprint: " + str(yt_vids))

    download_location = download_by_ytids(yt_vids)
    wav_location = convert_directory_to_wav(download_location)

    fingerprints_by_id = fingerprint_directory(wav_location)
    matches_by_id = find_matches(fingerprints_by_id)

    align_by_id = {}
    for matches_id in matches_by_id:
        align_by_id[matches_id] = align_matches(matches_by_id[matches_id])

    return jsonify(align_by_id)
