import { gql } from 'apollo-boost';

import apolloClient from './apollo';
import { parseUrls, ParsedUrl, UNKNOWN } from 'parse-urls';

const VIDEOS = gql`
  query($originId: String!, $origin: String!) {
    coords_video(
      where: { originId: { _eq: $originId }, origin: { _eq: $origin } }
    ) {
      id
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
  // TODO make query smart enough to bundle origins with the corresponding urls
  const result = await apolloClient.query({
    query: VIDEOS,
    variables: {
      originId: '',
      origin: '',
    },
  });

  return result;
};

export const align_handler = async (event: any) => {
  const body = JSON.parse(event.body);
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

  const result = checkExistingVideos(validUrls);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
