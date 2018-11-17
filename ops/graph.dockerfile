FROM graphprotocol/graph-node:v0.4.1

RUN mkdir -p /app
WORKDIR /app

RUN apt-get update && apt-get install -y bash curl jq && apt-get upgrade -y

COPY ops ops
COPY build build

ENTRYPOINT ["bash", "ops/entry.sh"]
