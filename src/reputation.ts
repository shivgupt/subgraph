// Required for dynamic memory allocation in WASM / AssemblyScript
import "allocator/arena";
export { allocate_memory };

// Import types and APIs from graph-ts
import {
  Entity,
  Value,
  store,
  crypto,
  ByteArray
} from "@graphprotocol/graph-ts";

import { Reputation, Mint, Burn } from "./types/Reputation/Reputation";

// Handler for Mint reputation events
export function mintReputation(event: Mint): void {
  let reputationContract = Reputation.bind(event.address);

  let ent = new Entity();
  ent.setAddress("address", event.params._to);
  ent.setU256("reputation", reputationContract.reputationOf(event.params._to));
  store.set("RepHolder", event.params._to.toHex(), ent);
}

// Handler for Burn reputation events
export function burnReputation(event: Burn): void {
  let reputationContract = Reputation.bind(event.address);

  let ent = new Entity();
  ent.setAddress("address", event.params._from);
  ent.setU256(
    "reputation",
    reputationContract.reputationOf(event.params._from)
  );
  store.set("RepHolder", event.params._from.toHex(), ent);
}
