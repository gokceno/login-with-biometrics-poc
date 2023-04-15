# Specify a base image
FROM node:18 AS build 

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

# Install NPM dependencies
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]