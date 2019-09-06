from os import listdir, makedirs, path

import ffmpeg
import youtube_dl
from flask import Flask
from flask.logging import create_logger

app = Flask(__name__)
log = create_logger(app)

TEMP_DIR = "temp"
OUT = "out"
OUTPUT_TEMPLATE = TEMP_DIR + "/%(id)s.%(ext)s"


@app.route("/")
def hello_world():
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

    # Convert all output files to wav files.
    outPath = path.join(TEMP_DIR, OUT)

    # Make output folder if it doesn't exist.
    if not path.exists(outPath):
        makedirs(outPath)

    downloadedVideos = [
        f for f in listdir(TEMP_DIR) if path.isfile(path.join(TEMP_DIR, f))
    ]
    for videoFile in downloadedVideos:
        log.info("videoFile: " + videoFile)

        wavOutputName = path.splitext(videoFile)[0] + ".wav"
        wavOutputPath = path.join(outPath, wavOutputName)

        # format='s16le', acodec='pcm_s16le' - Wav output
        # ac=1 - Single audio channel
        # ar='44100' - Sampling rate
        input = ffmpeg.input(path.join(TEMP_DIR, videoFile))
        out = ffmpeg.output(
            input.audio, wavOutputPath, format="wav", acodec="pcm_s16le", ac=1, ar=44100
        )
        out.run()

    return "Hello, World!"
