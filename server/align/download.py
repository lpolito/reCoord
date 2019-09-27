from os import path
from uuid import uuid4

import youtube_dl
from flask import current_app as APP


def download_by_ytids(yt_vids):
    def progress(status):
        if status["status"] == "finished":
            APP.logger.info(status)

    request_id = uuid4()
    request_id = str(request_id)

    output_dir = path.join(APP.config["TEMP_DIR"], request_id)
    outtmpl = output_dir + "/%(id)s.%(ext)s"

    ydl_opts = {
        "format": "bestaudio/best",
        "progress_hooks": [progress],
        "outtmpl": outtmpl,
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download(yt_vids)

    return output_dir
