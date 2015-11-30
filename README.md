# IoSL - Indoor Navigation - backend

Docker is used to containerize our backend services. Make sure docker and MongoDB are correctly installed on the host system. Start both the docker and the MongoDB service.

## Get dockerized application running

### Via 'plain' docker

Run
```bash
docker run --name mongo-db -d mongo:latest
```
to start the official MongoDB docker image as a daemon under the name 'mongo-db'.
TODO: Add mounted VOLUME?

If you experience space issue because MongoDB is not able to allocate enough space, run the above command with an additional `--smallfiles` at the end.

Now build and start the Node.JS component that connects to the Mongo database.
```bash
docker build -t iosl-inav/backend .
docker run --name backend -d -p 33333:8080 -e "PIAZZA_HOST=0.0.0.0 PIAZZA_SECRET=abc" --link mongo-db:mongo-db iosl-inav/backend:latest
```

Check `localhost:33333` in your host's browser to see if everything went fine.

### Via docker orchestration tool

Run
```bash
docker-compose up -d
docker-compose logs
```
to build, link and start all needed parts. Verify correctly running system by looking in the logs. You would get to see what `docker-compose logs` shows you if you had run `docker-compose up` without the daemonize flag.

To stop and remove all running docker instances (mind: not the images), run
```bash
docker-compose stop
docker-compose rm -f
```