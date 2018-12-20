#!/bin/bash

mode=${ethereum%%:*}
if [[ -z "$network_id" ]]
then network_id=4447
fi

echo "network_id=$network_id, mode=$mode, ethereum=$ethereum, ipfs=$ipfs"

bash /ops/wait-for.sh -t 60 $ipfs 2> /dev/null
bash /ops/wait-for.sh -t 60 graph_db:5432 2> /dev/null
[[ "$mode" == "dev" ]] && bash /ops/wait-for.sh -t 60 ethprovider:8545 2> /dev/null

subgraph="`curl -sF "file=@build/$network_id/subgraph.yaml" $ipfs/api/v0/add | jq .Hash | tr -d '"'`"

if [[ -z "$subgraph" ]]
then exit 1
else echo "subgraph=$subgraph"
fi

for file in build/$network_id/*
do curl -sF "file=@$file" $ipfs/api/v0/add?pin=true
done

exec graph-node \
  --debug \
  --postgres-url "postgresql://$postgres_user:`cat $postgres_pass_file`@$postgres_host/$postgres_db" \
  --ethereum-rpc "$ethereum" \
  --ipfs "$ipfs" \
  --subgraph "$subgraph"
