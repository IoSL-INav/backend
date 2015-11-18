# IoSL - Indoor Navigation - backend

Docker is used to containerize our backend services. Make sure docker is correctly installed on the host system.

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
docker run --name backend -d -p 33333:8080 --link mongo-db:mongo-db iosl-inav/backend:latest
```

Check `localhost:33333` in your host's browser to see if everything went fine.
