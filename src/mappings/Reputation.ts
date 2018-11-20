import 'allocator/arena'
export { allocate_memory }

import { Address, BigInt, ByteArray, crypto, store, } from '@graphprotocol/graph-ts'
import { Burn, Mint, } from '../types/Reputation/Reputation'
import { concat, getAccount, getDao, } from '../utils'
import { Account, DAO, ReputationChange, } from '../types/schema'

// TODO: Don't hardcode avatar address
let avatar = Address.fromString('a3f5411cfc9eee0dd108bf0d07433b6dd99037f1')

export function handleBurn(event: Burn): void {
    let account = getAccount(event.params._from, avatar)
    let repChangeId = crypto.keccak256(concat(event.transaction.hash, event.logIndex as ByteArray)).toHex()

    // Record the reputation change
    let repChange = new ReputationChange()
    repChange.dao = avatar.toHex()
    repChange.account = account.accountId
    repChange.amount = BigInt.fromI32(-1).times(event.params._amount)
    repChange.time = event.block.timestamp

    // Update account balances
    account.reputation = account.reputation.plus(repChange.amount)
    store.set('Account', account.accountId, account)

    // Update the DAO reputation supply
    let dao = getDao(avatar);
    dao.reputationAddress = event.address
    dao.reputationSupply = dao.reputationSupply.plus(repChange.amount)
    store.set('DAO', avatar.toHex(), dao)

    repChange.totalSupplyAfter = dao.reputationSupply
    store.set('ReputationChange', repChangeId, repChange)
}

export function handleMint(event: Mint): void {
    let account = getAccount(event.params._to, avatar)
    let repChangeId = crypto.keccak256(concat(event.transaction.hash, event.logIndex as ByteArray)).toHex()

    // Record the reputation change
    let repChange = new ReputationChange()
    repChange.dao = avatar.toHex()
    repChange.account = account.accountId
    repChange.amount = event.params._amount
    repChange.time = event.block.timestamp

    // Update account balances
    account.reputation = account.reputation.plus(repChange.amount)
    store.set('Account', account.accountId, account)

    // Update the DAO reputation supply
    let dao = getDao(avatar);
    dao.reputationAddress = event.address
    dao.reputationSupply = dao.reputationSupply.plus(repChange.amount)
    store.set('DAO', avatar.toHex(), dao)

    repChange.totalSupplyAfter = dao.reputationSupply
    store.set('ReputationChange', repChangeId, repChange)
}

