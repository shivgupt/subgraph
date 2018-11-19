FROM graphprotocol/graph-node:latest

RUN mkdir -p /app
WORKDIR /app

RUN apt-get update && apt-get install -y bash curl jq && apt-get upgrade -y

COPY ops ops
COPY build build

ENTRYPOINT ["bash", "ops/entry.sh"]
