#!/bin/bash

set -e

targets="GenesisProtocol DaoCreator UController Reputation ContributionReward"

if [[ -n "$1" ]]
then network_id="$1"
else network_id=4447
fi 

if [[ -n "$2" ]]
then ipfs="$2"
else ipfs="/dns4/ipfs/tcp/5001"
fi

if [[ "$network_id" == "1" ]]
then env=prod
else env=dev
fi

mkdir -p build/abis build/types build/$network_id
artifacts=node_modules/@daostack/arc/build/contracts
if [[ ! -d "$artifacts" ]]
then echo "Fatal: Couldn't find contract build artifacts in: $artifacts" && exit 1
fi

cp src/subgraph.yaml build/subgraph.$env.yaml

for target in $targets;
do
  echo "Processing $target..."
  if [[ ! -f "$artifacts/$target.json" ]]
  then echo "Fatal: couldn't find target: $artifacts/$target.json" && exit 1
  fi
  cat $artifacts/$target.json | jq '.abi' > ./build/abis/$target.json
  address="`cat $artifacts/$target.json | jq '.networks["'$network_id'"].address' | tr -d '"'`"
  if [[ "$address" == "null" ]]
  then address="0x0000000000000000000000000000000000000000"
  fi
  sed -i 's/{{'"$target"'Address}}/'"$address"'/' build/subgraph.$env.yaml
done

graph=../node_modules/.bin/graph
cp -r src/mappings src/schema.graphql src/*.ts build/
ln -sf ../node_modules build/node_modules

########################################
cd build

graph=../node_modules/.bin/graph

echo -n "Generating types..."
$graph codegen --output-dir types subgraph.$env.yaml

bash /ops/wait-for.sh -t 15 "`echo $ipfs | awk -F '/' '{print $3":"$5}'`" 2> /dev/null
echo "Compiling subgraph..."

# for more info re following witchcraft: https://stackoverflow.com/a/41943779
exec 5>&1
output="`$graph build --ipfs=$ipfs --output-dir=$env-dist subgraph.$env.yaml | tee /dev/fd/5; exit ${PIPESTATUS[0]}`"
subgraph="`echo $output | egrep -o "Subgraph: [a-zA-Z0-9]+" | sed 's/Subgraph: //'`"

curl -s ipfs:8080/ipfs/$subgraph > $network_id/subgraph.yaml

echo "$subgraph subgraph.yaml contains ipfs links:"
for link in `curl -s ipfs:8080/ipfs/$subgraph | grep "/ipfs/" | sed 's/ \/: //' | tr -d " "`
do
  echo " - $link"
  curl -s ipfs:8080$link > $network_id/${link##*/}
done
