from os import listdir, path
from typing import List


def get_dir_contents(dir: str) -> List[str]:
    return [f for f in listdir(dir) if path.isfile(path.join(dir, f))]
