import json
import logging
import os
from typing import List
from uuid import uuid4

from scipy.io import wavfile

from lib.fingerprint import fingerprint
from utils.Timer import Timer
from utils.utils import delete_directory

from parse_url import check_youtube
from convert import convert_video_to_wav
from download import download_by_url
from store import check_origin_by_id, save

logger = logging.getLogger()
logger.setLevel(logging.INFO)


TEMP_DIR = "/tmp"


def fingerprint_file(wav_file_path):
    buffer: List[int]
    _, buffer = wavfile.read(wav_file_path)

    # Generate fingerprint (convert generator to complete list of hashes).
    fingerprints = list(fingerprint(buffer))

    return fingerprints


def by_url(video_url: str):
    logger.info("## Fingerprint by URL started: " + video_url)

    request_timer = Timer().start()

    logger.info("## Checking if already fingerprinted in database.")

    url_info = check_youtube(video_url)
    if not url_info:
        # The provided URL isn't supported.
        logger.info("## URL is not supported. Complete request.")
        return {
            "statusCode": 400,
            "body": "Unsupported URL",
        }

    check_result = check_origin_by_id(**url_info)
    if check_result.get("coords_video"):
        # The provided video has been fingerprinted already.
        logger.info("## URL already fingerprinted. Complete request.")
        return {
            "statusCode": 200,
            "body": "URL already fingerprinted",
        }

    # Create a temp working directory to clean up in-case of resused lambdas.
    output_dir = os.path.join(TEMP_DIR, str(uuid4()))
    os.makedirs(output_dir)
    os.chdir(output_dir)

    logger.info("## Temp directory: " + output_dir)

    # Download video.
    download_timer = Timer().start()
    download_meta = download_by_url(video_url)
    download_timer.end()

    video_info = {
        "url": video_url,
        "origin_id": download_meta.get("id"),
        "title": download_meta.get("title"),
        "duration": download_meta.get("duration"),
    }

    logger.info("## Converting to WAV started.")

    # Convert downloaded videos to wav format.
    wav_conversion_timer = Timer().start()
    wav_location = convert_video_to_wav()
    wav_conversion_timer.end()

    logger.info("## Converting to WAV complete.")

    logger.info("## Wav to fingerprint started: " + wav_location)

    # Fingerprint wav file.
    fingerprint_timer = Timer().start()
    fingerprints = fingerprint_file(wav_location)
    fingerprint_timer.end()

    logger.info("## Fingerprint completed.")

    logger.info("## Saving video started.")

    # Save video info and fingerprints to database.
    save_timer = Timer().start()
    save(
        fingerprints=fingerprints,
        fingerprint_version="v0",
        origin="youtube",
        **video_info,
    )
    save_timer.end()

    logger.info("## Saving video completed.")

    time_stats = {
        "download_total": download_timer.get_diff_seconds(),
        "wav_conversion_total": wav_conversion_timer.get_diff_seconds(),
        "fingerprint_total": fingerprint_timer.get_diff_seconds(),
        "save_total": save_timer.get_diff_seconds(),
        "request_total": request_timer.end().get_diff_seconds(),
    }

    response = {
        "statusCode": 200,
        "body": json.dumps({"video_info": video_info, "time_stats": time_stats}),
    }

    logger.info("## Fingerprint by URL complete. Cleaning up directory: " + output_dir)
    logger.info(time_stats)

    # Delete working directory.
    os.chdir(TEMP_DIR)
    delete_directory(output_dir)

    return response
