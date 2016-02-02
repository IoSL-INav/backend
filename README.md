# IoSL - Indoor Navigation - backend

## For development

First update git and submodules
```bash
git pull && git submodule init && git submodule update && git submodule status
```

Install all packages for npm
```bash
npm install
```

At this point, make sure to have started the MongoDB service.

Create an environment file to provide the correct values according to your (development) setup. If you do not further specify an environment variable, production values will be used. Open a file `.env` and put in something like this:

```js
process.env.PIAZZA_HOST = 'localhost';
process.env.PIAZZA_DB = 'mongodb://localhost:27017/iosl-inav';
process.env.PIAZZA_SECRET = "Think of a very long sentence and maybe even include some 13375p34k and $%&";
process.env.PIAZZA_LOG_FILE = "./test-logging.log";
process.env.PIAZZA_USE_MONGODB_SESSION_STORE = true;
process.env.TEST_MODE = false;
```

After setting these environment variables through the .env file you can very easily run:
```bash
node app.js
```

## Setup

Clone this repository to the desired location on your system. To include submodules this project uses, use the `--recursive` flag during cloning.

Docker is used to containerize our backend services. Make sure docker and MongoDB are correctly installed on the host system. Start both the docker and the MongoDB service.

## Get dockerized application running

### Via 'plain' docker

Run
```bash
docker run --name mongo-db -d mongo:latest
```
to start the official MongoDB docker image as a daemon under the name 'mongo-db'.

If you experience space issue because MongoDB is not able to allocate enough space, run the above command with an additional `--smallfiles` at the end.

Now build and start the Node.JS component that connects to the Mongo database.
```bash
docker build -t iosl-inav/backend .
docker run --name backend -d -p 33333:8080 --link mongo-db:mongo-db iosl-inav/backend:latest
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

To simply update the backend docker to a just committed change, run the following commands inside the git folder:
```bash
docker stop <backend process>
docker rm <backend process>
git pull
docker-compose build
docker-compose up -d
```

## Empty MongoDB to get a fresh environment

If you feel the need to flush the MongoDB in order to start fresh, you can use the following command:

```bash
mongo iosl-inav --eval "db.dropDatabase()"
```

## Testing

In order to run the provided API tests, you have to set some environment variables similar to running the server for development mode locally. Open a file `.env.test` and specify:

```js
process.env.PIAZZA_HOST = 'localhost';
process.env.PIAZZA_DB = 'mongodb://localhost:27017/iosl-inav';
process.env.PIAZZA_SECRET = "Think of a very long sentence and maybe even include some 13375p34k and $%&";
process.env.PIAZZA_LOG_FILE = "./test-logging.log";
process.env.PIAZZA_USE_MONGODB_SESSION_STORE = true;
process.env.TEST_MODE = true;
```

After this is done, you can run the provided tests with:

```bash
npm test
```