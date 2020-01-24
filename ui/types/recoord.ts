interface Coord {
  id: number;
  name: string;
  length: number;
  clips: Clip[];
}

interface Clip {
  id: number;
  url: string;
  duration: number;
  title: string;
  thumbnails: any;
  timePosition: number;
}
