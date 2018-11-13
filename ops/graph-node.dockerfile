FROM alpine:3.8

RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community cargo clang-dev git postgresql-dev &&\
    git clone https://github.com/graphprotocol/graph-node &&\
    cd graph-node &&\
    git checkout 71b3f83032b22a8b6faea6a65da99adceb83273b &&\
    cargo install --path node --root /usr/local &&\
    cd .. &&\
    rm -rf graph-node &&\
    apk del cargo

ENTRYPOINT ["graph-node"]
