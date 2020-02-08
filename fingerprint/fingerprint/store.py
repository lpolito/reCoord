import json
import logging

from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport

logger = logging.getLogger()
logger.setLevel(logging.INFO)


http_transport = RequestsHTTPTransport(
    "youshouldputgraphqlserverhttpaddresshere", use_json=True
)

client = Client(transport=http_transport)


def save(fingerprints, **kwargs):
    logger.info("## Saving video and fingerprints to database")

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
    logger.info(response)

    return response
