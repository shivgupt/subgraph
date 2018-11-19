FROM node:10.13-alpine

RUN mkdir -p /app
WORKDIR /app

RUN apk add --update --no-cache bash curl g++ gcc git jq make python
RUN yarn global add webpack webpack-cli webpack-dev-server nodemon

COPY package.json package.json
RUN yarn install

VOLUME ops
VOLUME src
VOLUME build

ENTRYPOINT ["webpack"]
