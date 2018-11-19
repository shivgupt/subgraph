import {
    Address,
    BigInt,
    ByteArray,
    Bytes,
    crypto,
    SmartContract,
    store,
} from '@graphprotocol/graph-ts'

import {
    Account,
    DAO,
    Redemption,
} from './types/schema'

export const REWARD_TYPE_INITIAL_MINT = 1 
export const REWARD_TYPE_CONTRIBUTION_REWARD_Nat = 0
export const REWARD_TYPE_GENESIS_PROTOCOL_PROPOSER = 2
export const REWARD_TYPE_GENESIS_PROTOCOL_STAKER = 3
export const REWARD_TYPE_GENESIS_PROTOCOL_VOTER = 4
export const REWARD_TYPE_GENESIS_PROTOCOL_BOUNTY = 5

export function concat(a: ByteArray, b: ByteArray): ByteArray {
    let out = new Uint8Array(a.length + b.length)
    for (let i = 0; i < a.length; i++) {
        out[i] = a[i]
    }
    for (let j = 0; j < b.length; j++) {
        out[a.length + j] = b[j]
    }
    return out as ByteArray
}

export function getDao (avatar: Address): DAO {
    let dao = store.get('DAO', avatar.toHex()) as DAO
    if (dao == null) {
        dao = new DAO()
        dao.avatarAddress = avatar
        dao.reputationSupply = BigInt.fromI32(0)
        store.set('DAO', avatar.toHex(), dao)
    }
    return dao;
}

export function getAccount (address: Address, avatar: Address): Account {
    let accountId = crypto.keccak256(concat(address, avatar)).toHex()
    let account = store.get('Account', accountId) as Account
    if (account == null) {
        account = new Account()
        account.accountId = accountId
        account.dao = avatar.toHex()
        account.address = address
        account.reputation = BigInt.fromI32(0)
        store.set('Account', accountId, account)
    }
    return account
}

export function updateRedemption(
    avatar: Address,
    beneficiary: Address,
    proposalId: Bytes,
    typeNumber: ByteArray,
    typeString: String,
    amount: BigInt,
    time: BigInt
): void {
    let account = getAccount(beneficiary, avatar)
    let redemptionId = crypto.keccak256(
        concat(proposalId,
        concat(beneficiary, typeNumber))
    ).toHex()

    let redemption = new Redemption()
    redemption.dao = avatar.toHex()
    redemption.account = account.accountId
    redemption.proposal = proposalId.toHex()
    redemption.type = typeString
    redemption.amount = amount

    store.set('Redemption', redemptionId, redemption)
}
