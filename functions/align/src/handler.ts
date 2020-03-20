import { gql } from 'apollo-boost';

import { Video } from './types';

import apolloClient from './apollo';
import { parseUrls, ParsedUrl, UNKNOWN } from 'parse-urls';
import { findMatches } from 'match';

interface BundledUrls {
  [key: string]: String[];
}

// TODO confirm fingerprint versions are current.
const buildVideoQuery = (urls: BundledUrls) => gql`
  query {
    coords_video(where: {_or: [
      ${Object.entries(urls)
        .map(
          ([origin, originIds]) => `
          {
            origin: { _eq: ${origin} },
            originId: { _in: ${JSON.stringify(originIds)} },
          }`
        )
        .join(',')}
    ]}) {
      id
      origin
      originId
      title
      duration
      fingerprints
    }
  }
`;

const bundleUrlsByOrigin = (parsedUrls: ParsedUrl[]): BundledUrls =>
  parsedUrls.reduce((acc: BundledUrls, { origin, originId }) => {
    if (!acc[origin]) {
      return {
        ...acc,
        [origin]: [originId],
      };
    }

    return {
      ...acc,
      [origin]: [...acc[origin], originId],
    };
  }, {} as BundledUrls);

const checkExistingVideos = async (urls: BundledUrls) =>
  await apolloClient.query<Video[]>({
    query: buildVideoQuery(urls),
  });

export const alignHandler = async (event: any) => {
  const body = JSON.parse(event.body);
  // const { body } = event;
  const { urls } = body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return {
      statusCode: 400,
      body: 'bad request',
    };
  }

  const parsedUrls = parseUrls(urls);
  const bundledUrls = bundleUrlsByOrigin(parsedUrls);

  const { [UNKNOWN]: unknownUrls, ...validUrls } = bundledUrls;

  const { data: videos, errors } = await checkExistingVideos(validUrls);

  // TODO fingerprint all videos not found in database. Need some sort of async process to do that.

  // Any videos we already have the fingerprints for need to be matched and aligned.
  const matches = findMatches(videos);

  // TODO return unknownURLs as errored videos
  return {
    statusCode: 200,
    body: {
      videos,
      errors,
    },
  };
};
