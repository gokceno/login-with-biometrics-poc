# Specify a base image
FROM node:15 AS build 

# Install build tools
RUN apt-get update -y && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install other tools
RUN apt-get install -y nano

# Change working directory
WORKDIR /usr/app

# Install NPM packages individually
RUN npm install pg express express-graphql graphql multer pino pino-pretty pino-http --save
RUN npm install --build-from-source canvas
RUN npm install face-api.js@0.21.0
RUN npm install @tensorflow/tfjs-node@1.2.11

# Copy in the app and weights
COPY ./ /usr/app

EXPOSE 4000

CMD ["node", "src/server.js"]