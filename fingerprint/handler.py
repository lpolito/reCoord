import json

from fingerprint.fingerprinter import by_url


def fingerprint_handler(event, context):
    body = json.loads(event["body"])
    video_url: str = body.get("url")

    return by_url(video_url)
