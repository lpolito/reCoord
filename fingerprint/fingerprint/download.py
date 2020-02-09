import logging

import youtube_dl

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def download_by_url(url: str):
    def progress(status):
        if status["status"] == "finished":
            logger.info(status)

    ydl_opts = {
        "format": "bestaudio/best",
        "progress_hooks": [progress],
        "outtmpl": "%(id)s.%(ext)s",
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        # Don't use default YoutubeDL download function so we can get metadata.
        try:
            return ydl.extract_info(
                url,
                force_generic_extractor=ydl.params.get(
                    "force_generic_extractor", False
                ),
            )
        except Exception as e:
            logger.error(e)
            raise
