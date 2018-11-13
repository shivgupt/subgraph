import 'allocator/arena'
export { allocate_memory }

import { Entity, Address, Value, store, crypto, ByteArray } from '@graphprotocol/graph-ts'

import { Reputation, Mint, Burn } from '../types/Reputation/Reputation'
import { concat, createAccount, createDao } from '../utils'

let avatar = Address.fromString('a3f5411cfc9eee0dd108bf0d07433b6dd99037f1')

export function handleMint(event: Mint): void {
    let accountId = createAccount(event.params._to, avatar)
    let account = new Entity()
    account.setBoolean('hasReputation', true)
    store.set('Account', accountId.toHex(), account as Entity)
    let dao = createDao(avatar);
    dao.setAddress('reputationAddress', event.address)
    let members = dao.getArray('members') as Array<Value>
    members.push(Value.fromString(accountId.toHex()))
    dao.setArray('members', members)
    store.set('DAO', avatar.toHex(), dao as Entity)
}

// TODO: remove user from members on Burn event
