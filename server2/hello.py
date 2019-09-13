from os import listdir, makedirs, path

import ffmpeg
import numpy as np
import youtube_dl
from flask import Flask, jsonify, request
from flask.logging import create_logger
from scipy.io import wavfile
from matching import find_matches, align_matches

# from uuid import uuid4

from fingerprint import fingerprint

app = Flask(__name__)
log = create_logger(app)

TEMP_DIR = "temp"
OUT_DIR = "out"


def get_dir_contents(dir):
    return [f for f in listdir(dir) if path.isfile(path.join(dir, f))]


def download_videos(yt_vids):
    def progress(status):
        if status["status"] == "finished":
            log.info(status)

    # request_id = uuid4()
    # request_id = str(id)
    request_id = "1"

    output_dir = path.join(TEMP_DIR, request_id)
    # outtmpl = output_dir + "/%(id)s.%(ext)s"

    # ydl_opts = {
    #     "format": "bestaudio/best",
    #     "progress_hooks": [progress],
    #     "outtmpl": outtmpl,
    # }

    # with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    #     ydl.download(yt_vids)

    return output_dir


def convert_videos_to_wav(download_location):
    # Convert all output files to wav files.
    out_path = path.join(download_location, OUT_DIR)

    # Make output folder if it doesn't exist.
    # if not path.exists(out_path):
    #     makedirs(out_path)

    # downloaded_videos = get_dir_contents(download_location)

    # for video_file in downloaded_videos:
    #     log.info("Video file to convert: " + video_file)

    #     # Get file name without extension and append .wav
    #     wav_output_name = path.splitext(video_file)[0] + ".wav"
    #     wav_output_path = path.join(out_path, wav_output_name)

    #     # format='wav', acodec='pcm_s16le' - Wav output
    #     # ac=1 - Single audio channel
    #     # ar=44100 - Sampling rate
    #     input = ffmpeg.input(path.join(download_location, video_file))
    #     out = ffmpeg.output(
    #         input.audio,
    #         wav_output_path,
    #         format="wav",
    #         acodec="pcm_s16le",
    #         ac=1,
    #         ar=44100,
    #     )
    #     out.run()

    return out_path


def fingerprint_directory(wav_location):
    fingerprints_by_id = {}

    output_wavs = get_dir_contents(wav_location)

    for wav_file in output_wavs:
        yt_id = path.splitext(wav_file)[0]

        wav_file_path = path.join(wav_location, wav_file)

        log.info("Wav to fingerprint: " + wav_file_path)
        _, buffer = wavfile.read(wav_file_path)

        # Generate fingerprint (convert generator to complete list of hashes).
        hashes = list(fingerprint(buffer))

        fingerprints_by_id[yt_id] = hashes

    return fingerprints_by_id


@app.route("/", methods=["POST"])
def hello_world():
    req_data = request.get_json()
    yt_vids = req_data["ytVids"]

    log.info("Videos to  to fingerprint: " + str(yt_vids))

    download_location = download_videos(yt_vids)
    wav_location = convert_videos_to_wav(download_location)
    fingerprints_by_id = fingerprint_directory(wav_location)

    matches_by_id = find_matches(fingerprints_by_id)

    align_by_id = {}
    for matches_id in matches_by_id:
        align_by_id[matches_id] = align_matches(matches_by_id[matches_id])

    # Convert numpy numbers to int for jsonify.
    # for id in result:
    #     result[id] = [(hash, int(offset)) for hash, offset in result[id]]

    return jsonify(align_by_id)
