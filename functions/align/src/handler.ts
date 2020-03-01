import { gql } from 'apollo-boost';

import apolloClient from './apollo';

const VIDEOS = gql`
  {
    coords_video {
      id
      title
    }
  }
`;

export const align_handler = async (event: any) => {
  const result = await apolloClient
    .query({
      query: VIDEOS,
    })
    .then(result => {
      console.log(result);
      console.log(JSON.stringify(event));

      return {
        statusCode: 200,
        body: 'fine',
      };
    });

    return result;
};
