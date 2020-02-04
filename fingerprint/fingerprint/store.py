import logging

from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport

logger = logging.getLogger()
logger.setLevel(logging.INFO)


http_transport = RequestsHTTPTransport(
    "youshouldputgraphqlserverhttpaddresshere", use_json=True
)

client = Client(transport=http_transport)


def get_fingerprints_gql(fingerprint_version, fingerprints, **_):
    result = ""
    for fingerprint, time_offset in fingerprints:
        result += '{{ hash: "{hash}", timeOffset: {time_offset}, version: {version} }},'.format(
            version=fingerprint_version, hash=fingerprint, time_offset=time_offset
        )

    return result


def save(**kwargs):
    logger.info("## Saving video and fingerprints to database")

    fingerprints = get_fingerprints_gql(**kwargs)

    format_args = {**kwargs, "fingerprints": fingerprints}
    print(format_args)
    query = gql(
        """mutation {{
          insert_coords_video(
            objects: {{
              origin: {origin},
              originId: "{origin_id}",
              title: "{title}",
              duration: {duration}
              fingerprints: {{
                data: [{fingerprints}]
              }}
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


# save(
#     fingerprints=[["test", 5]],
#     fingerprint_version="v0",
#     origin="youtube",
#     origin_id="",
#     title="",
#     duration=0,
# )

