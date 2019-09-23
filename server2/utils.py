from os import listdir, path


def get_dir_contents(dir):
    return [f for f in listdir(dir) if path.isfile(path.join(dir, f))]
