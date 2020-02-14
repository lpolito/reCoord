import re


def check_youtube(video_url: str):
    match = re.match(
        "^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$",
        video_url,
    )

    if match is None:
        return False

    return {"origin": "youtube", "origin_id": match.group(5)}
