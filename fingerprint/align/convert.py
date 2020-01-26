from os import makedirs, path

import ffmpeg
from flask import current_app as APP

from utils.utils import get_dir_contents


def convert_directory_to_wav(download_location):
    # Convert all output files to wav files.
    out_path = path.join(download_location, APP.config["OUT_DIR"])

    # Make output folder if it doesn't exist.
    if not path.exists(out_path):
        makedirs(out_path)

    downloaded_videos = get_dir_contents(download_location)

    for video_file in downloaded_videos:
        APP.logger.info("Video file to convert: " + video_file)

        # Get file name without extension and append .wav
        wav_output_name = path.splitext(video_file)[0] + ".wav"
        wav_output_path = path.join(out_path, wav_output_name)

        # format='wav', acodec='pcm_s16le' - Wav output
        # ac=1 - Single audio channel
        # ar=44100 - Sampling rate
        input = ffmpeg.input(path.join(download_location, video_file))
        out = ffmpeg.output(
            input.audio,
            wav_output_path,
            format="wav",
            acodec="pcm_s16le",
            ac=1,
            ar=44100,
        )
        out.run()

    return out_path
