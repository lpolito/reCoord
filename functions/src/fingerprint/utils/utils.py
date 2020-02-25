import pathlib
from os import listdir, path
from typing import List


def get_dir_contents(dir: str) -> List[str]:
    return [f for f in listdir(dir) if path.isfile(path.join(dir, f))]


def delete_directory(pth):
    pth = pathlib.Path(pth)
    for sub in pth.iterdir():
        if sub.is_dir():
            delete_directory(sub)
        else:
            sub.unlink()
    pth.rmdir()
