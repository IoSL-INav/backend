# The Node.JS base image is a good starting point
FROM node:latest

MAINTAINER SNET Internet of Services Lab - Indoor Navigation

# Keep the system up to date
RUN apt-get update \
    && apt-get install -y apt-utils \
    && apt-get upgrade -y \
    && apt-get autoremove

# Create needed folders
RUN mkdir /src

# Copy application files to /src
COPY . /src

# Install Node.JS dependencies
COPY package.json /src/package.json
RUN cd /src && npm install

# Expose port 8080 to be passed through to host
EXPOSE 8080

# Run Node.JS app
CMD ["node", "/src/app.js"]
