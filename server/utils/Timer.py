import datetime


class Timer:
    def start(self) -> "Timer":
        self.start_time = datetime.datetime.now()
        return self

    def end(self) -> "Timer":
        self.diff = datetime.datetime.now() - self.start_time
        return self

    def get_diff_seconds(self) -> float:
        return self.diff.total_seconds()
