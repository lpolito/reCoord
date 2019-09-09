from os import listdir, makedirs, path

import ffmpeg
import numpy as np
import youtube_dl
from flask import Flask, jsonify
from flask.logging import create_logger
from scipy.io import wavfile

from fingerprint import fingerprint

app = Flask(__name__)
log = create_logger(app)

TEMP_DIR = "temp"
OUT = "out"
OUTPUT_TEMPLATE = TEMP_DIR + "/%(id)s.%(ext)s"


def download_videos():
    def progress(status):
        if status["status"] == "finished":
            log.info(status)

    ydl_opts = {
        "format": "bestaudio/best",
        "progress_hooks": [progress],
        "outtmpl": OUTPUT_TEMPLATE,
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download(["https://www.youtube.com/watch?v=6Y0WE625Mo4"])

    return TEMP_DIR


def convert_videos_to_wav(downloadLocation):
    # Convert all output files to wav files.
    outPath = path.join(downloadLocation, OUT)

    # Make output folder if it doesn't exist.
    if not path.exists(outPath):
        makedirs(outPath)

    downloadedVideos = [
        f for f in listdir(downloadLocation) if path.isfile(path.join(downloadLocation, f))
    ]
    for videoFile in downloadedVideos:
        log.info("videoFile: " + videoFile)

        # Get file name without extension and append .wav
        wavOutputName = path.splitext(videoFile)[0] + ".wav"
        wavOutputPath = path.join(outPath, wavOutputName)

        # format='s16le', acodec='pcm_s16le' - Wav output
        # ac=1 - Single audio channel
        # ar='44100' - Sampling rate
        input = ffmpeg.input(path.join(downloadLocation, videoFile))
        out = ffmpeg.output(
            input.audio, wavOutputPath, format="wav", acodec="pcm_s16le", ac=1, ar=44100
        )
        out.run()

    return outPath


def fingerprint_directory(wavLocation):
    allFingerprints = {}

    outputWavs = [f for f in listdir(wavLocation) if path.isfile(path.join(wavLocation, f))]
    for wavFile in outputWavs:
        id = path.splitext(wavFile)[0]

        wavLocation = path.join(wavLocation, wavFile)
        log.info(wavLocation)

        _, buffer = wavfile.read(wavLocation)

        # Generate fingerprint.
        hashes = fingerprint(buffer)
        result = set(hashes)

        allFingerprints[id] = result

    return allFingerprints


@app.route("/")
def hello_world():

    downloadLocation = download_videos()
    wavLocation = convert_videos_to_wav(downloadLocation)
    fingerprint_directory(wavLocation)

    return "Hello world!"
