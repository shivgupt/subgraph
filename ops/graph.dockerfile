FROM alchemy_builder:dev as base
FROM graphprotocol/graph-node:v0.5.0
WORKDIR /root
ENV HOME /root

RUN apt-get update && apt-get install -y bash curl jq && apt-get upgrade -y

COPY --from=base /ops /ops
COPY ops ops
COPY build build

ENTRYPOINT ["bash", "ops/entry.sh"]
