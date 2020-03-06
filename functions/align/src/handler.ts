import { gql } from 'apollo-boost';

import apolloClient from './apollo';
import { parseUrls, ParsedUrl, UNKNOWN } from 'parse-urls';

const VIDEOS = (urls: BundledUrls) => gql`
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
      originId
    }
  }
`;

interface BundledUrls {
  [key: string]: String[];
}
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

const checkExistingVideos = async (urls: BundledUrls) => {
  const result = await apolloClient.query({
    query: VIDEOS(urls),
  });

  return result;
};

export const align_handler = async (event: any) => {
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

  const result = await checkExistingVideos(validUrls);

  return {
    statusCode: 200,
    body: result,
  };
};
