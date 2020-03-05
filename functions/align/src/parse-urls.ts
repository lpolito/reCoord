export interface ParsedUrl {
  origin: string;
  originId: string;
}

const YOUTUBE = 'youtube';
const youtube = (url: string): ParsedUrl | null => {
  const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gi;

  const result = regex.exec(url);

  if (!result) return null;

  return {
    origin: YOUTUBE,
    originId: result[5],
  };
};

export const UNKNOWN = 'unknown';
const unknownOrigin = (url: string) => ({
  origin: UNKNOWN,
  originId: url,
});

export const parseUrls = (urls: string[]) =>
  urls.map(url => youtube(url) || unknownOrigin(url));
