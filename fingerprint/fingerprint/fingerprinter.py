import json
import logging
import os
from typing import List

from scipy.io import wavfile

from lib.fingerprint import fingerprint
from utils.Timer import Timer

from .convert import convert_video_to_wav
from .download import download_by_url
from .store import save

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def fingerprint_file(wav_file_path):
    logger.info("Wav to fingerprint: " + wav_file_path)

    buffer: List[int]
    _, buffer = wavfile.read(wav_file_path)

    # Generate fingerprint (convert generator to complete list of hashes).
    fingerprints = list(fingerprint(buffer))

    return fingerprints


def by_url(video_url):
    logger.info("## Video to fingerprint:" + video_url)

    request_timer = Timer().start()

    # Changing working directory to /tmp for storage.
    os.chdir("/tmp")

    # Download video.
    download_timer = Timer().start()
    download_by_url(video_url)
    download_timer.end()

    # Convert downloaded videos to wav format.
    wav_conversion_timer = Timer().start()
    wav_location = convert_video_to_wav()
    wav_conversion_timer.end()

    # Fingerprint wav file.
    fingerprint_timer = Timer().start()
    fingerprints = fingerprint_file(wav_location)
    fingerprint_timer.end()

    # Save video info and fingerprints to database.
    save_timer = Timer().start()
    save(
        fingerprints=fingerprints,
        fingerprint_version="v0",
        origin="youtube",
        origin_id="notreal",
        title=video_url,
        duration=0,
    )
    save_timer.end()

    time_stats = {
        "download_total": download_timer.get_diff_seconds(),
        "wav_conversion_total": wav_conversion_timer.get_diff_seconds(),
        "fingerprint_total": fingerprint_timer.get_diff_seconds(),
        "save_total": save_timer.get_diff_seconds(),
        "request_total": request_timer.end().get_diff_seconds(),
    }

    response = {
        "statusCode": 200,
        "body": json.dumps({"fingerprints": fingerprints, "time_stats": time_stats}),
    }

    logger.info(time_stats)

    return response