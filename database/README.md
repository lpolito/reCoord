## Start Hasura and Postgres docker containers

docker-compose up -d

## Install Hasura cli

curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash

## Use Hasura cli console for all actions (ensures migrations are tracked)

hasura console
