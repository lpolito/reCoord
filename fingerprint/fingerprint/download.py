import logging

import youtube_dl

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def download_by_url(url: str) -> None:
    def progress(status):
        if status["status"] == "finished":
            logger.info(status)

    # request_id = uuid4()
    # request_id = str(request_id)

    # output_dir = path.join(APP.config["TEMP_DIR"], request_id)
    # outtmpl = output_dir + "/%(id)s.%(ext)s"

    ydl_opts = {
        "format": "bestaudio/best",
        "progress_hooks": [progress],
        "outtmpl": "%(id)s.%(ext)s",
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        # Don't use default YoutubeDL download function so we can get metadata.
        try:
            # It also downloads the videos
            return ydl.extract_info(
                url,
                force_generic_extractor=ydl.params.get(
                    "force_generic_extractor", False
                ),
            )
        except Exception as e:
            logger.error(e)
            raise
