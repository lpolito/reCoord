import json
import logging
import os
from urllib.parse import urlparse

import pg8000

logger = logging.getLogger()
logger.setLevel(logging.INFO)

DB_URI = os.environ["DB_URI"]

parsed_uri = urlparse(DB_URI)
DB_USER = parsed_uri.username
DB_PASS = parsed_uri.password
DB_NAME = parsed_uri.path[1:]
DB_HOST = parsed_uri.hostname

def save(
  origin,
  origin_id,
  title,
  duration,
  fingerprints,
  fingerprint_version,
  **kwargs
):
    # Convert array of tuples to array of arrays json string.
    fingerprints_json = json.dumps(fingerprints)

    sql = """INSERT INTO coords.video(
              origin,
              origin_id,
              title,
              duration,
              fingerprints,
              fingerprint_version
            )
            VALUES(%s, %s, %s, %s, %s, %s)
            RETURNING id;"""

    conn = None
    video_id = None
    try:
        # connect to the PostgreSQL server
        logger.info("## Connecting to: " + DB_URI)
        conn = pg8000.connect(
          database = DB_NAME,
          user = DB_USER,
          password = DB_PASS,
          host = DB_HOST,
          ssl = True
        )
      
        # Create cursor.
        cur = conn.cursor()
        
        # Insert video into db.
        cur.execute(sql, (
          origin,
          origin_id,
          title,
          duration,
          fingerprints_json,
          fingerprint_version,
        ))

        # Get the generated id back.
        video_id = cur.fetchone()[0]

        # Commit the changes.
        conn.commit()

        logger.info("## Successfully added video: " + str(video_id))
       
        # Close the connection.
        cur.close()
    except (Exception) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return video_id
