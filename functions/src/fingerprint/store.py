import json
import logging
import os

from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport

logger = logging.getLogger()
logger.setLevel(logging.INFO)

GRAPHQL_ENDPOINT = os.environ["GRAPHQL_ENDPOINT"]


http_transport = RequestsHTTPTransport(GRAPHQL_ENDPOINT, use_json=True)

client = Client(transport=http_transport)


def save(fingerprints, **kwargs):
    logger.info("Database url: " + GRAPHQL_ENDPOINT)

    # Convert array of tuples to array of arrays json string.
    fingerprints_json = json.dumps(fingerprints)

    format_args = {**kwargs, "fingerprints": fingerprints_json}
    query = gql(
        """mutation {{
          insert_coords_video(
            objects: {{
              origin: {origin},
              originId: "{origin_id}",
              title: "{title}",
              duration: {duration},
              fingerprints: {fingerprints},
              fingerprint_version: {fingerprint_version}
            }}
          ) {{
            returning {{
              id
              createdAt
              origin
              originId
              title
            }}
          }}
        }}""".format(
            **format_args
        )
    )

    response = client.execute(query)

    logger.info("Database response:")
    logger.info(response)

    return response


def check_origin_by_id(**kwargs):
    logger.info("Database url: " + GRAPHQL_ENDPOINT)

    query = gql(
        """query {{
          coords_video(where: {{
            originId: {{_eq: "{origin_id}"}},
            origin: {{_eq: {origin}}}
          }}) {{
            id
          }}
        }}""".format(
            **kwargs
        )
    )

    response = client.execute(query)

    logger.info("Database response:")
    logger.info(response)

    return response