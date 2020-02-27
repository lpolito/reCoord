import logging
import os

import ffmpeg
from utils.utils import get_dir_contents

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def convert_video_to_wav() -> str:
    cur_dir = os.getcwd()

    out_path = os.path.join(cur_dir, "out")

    # Get the list of videos downloaded
    # TODO figure out how to get the single downloaded video path instead of searching a directory
    downloaded_videos = get_dir_contents(cur_dir)

    # Make output folder if it doesn't exist.
    if not os.path.exists(out_path):
        os.makedirs(out_path)

    if len(downloaded_videos) > 1:
        logger.error("## ERROR - More than one downloaded video, exit.")
        raise SystemExit(0)

    video_file = downloaded_videos[0]

    logger.info("## Video file to convert: " + video_file)

    # Get file name without extension and append .wav
    wav_output_name = os.path.splitext(video_file)[0] + ".wav"
    wav_output_path = os.path.join(out_path, wav_output_name)

    # format='wav', acodec='pcm_s16le' - Wav output
    # ac=1 - Single audio channel
    # ar=44100 - Sampling rate
    input = ffmpeg.input(os.path.join(cur_dir, video_file))
    out = ffmpeg.output(
        input.audio, wav_output_path, format="wav", acodec="pcm_s16le", ac=1, ar=44100
    )
    out.run()

    return wav_output_path
