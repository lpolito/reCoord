from typing import Dict, List, Tuple, TypedDict

Hash = str
TimeOffset = int
Fingerprint = Tuple[Hash, TimeOffset]

FileId = str
FingerprintsByFileId = Dict[FileId, List[Fingerprint]]


class Align(TypedDict):
    confidence: int
    offset_seconds: int
    match_id: int


HashId = str
MatchOffsetDiff = int
Match = Tuple[HashId, MatchOffsetDiff]

MatchesByFileId = Dict[FileId, List[Match]]
