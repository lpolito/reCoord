## Create docker postgres instance and forward port 5432

docker run --name recoord -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres

## Connect to docker postgres, password = password

psql -h 0.0.0.0 -p 5432 -U postgres
