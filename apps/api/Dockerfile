 # Specify a base image
FROM node:18 AS build 

# Install build tools
RUN apt-get update -y && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

# Install NPM dependencies
RUN npm install --build-from-source canvas@2.11.2
RUN npm install @tensorflow/tfjs-node@4.4.0
RUN npm rebuild @tensorflow/tfjs-node@4.4.0 --build-from-source
RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start"]