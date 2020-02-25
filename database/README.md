Start Hasura and Postgres docker containers

```console
docker-compose up -d
```

Install Hasura cli

```console
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

Use Hasura cli console for all actions (ensures migrations are tracked)

```console
hasura console
```