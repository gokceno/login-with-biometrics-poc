# Specify a base image
FROM node:18 AS builder

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

# Install NPM dependencies
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn install

# Build app
RUN yarn build

FROM nginx AS runner

COPY --from=builder /usr/app/.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html