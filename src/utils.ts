import { Address, U256, I256, Bytes, Entity, ByteArray, crypto, store, Value } from '@graphprotocol/graph-ts'

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

export function createDao (avatar: Address): Entity {
  let dao = store.get('DAO', avatar.toHex()) as Entity
  if (dao === null) {
    dao = new Entity()
    dao.setAddress('avatarAddress', avatar)
    dao.setArray('members', new Array<Value>())
    store.set('DAO', avatar.toHex(), dao as Entity)
  }
  return dao;
}

export function createAccount (address: Address, avatar: Address): ByteArray {
    let accountId = crypto.keccak256(concat(address, avatar))
    let account = store.get('Account', accountId.toHex())
    if (account == null) {
        account = new Entity()
        account.setString('accountId', accountId.toHex())
        account.setAddress('dao', avatar)
        account.setAddress('address', address)
        account.setBoolean('hasReputation', false)
        store.set('Account', accountId.toHex(), account as Entity)
    }
    return accountId
}

export function updateRedemption(
  beneficiary: Address,
  avatar: Address,
  absAmount: U256,
  signedAmount: I256,
  proposalId: Bytes,
  rewardType: ByteArray,
  rewardString: String,
  time: U256
): void {
    let accountId = createAccount(beneficiary, avatar)
    let redemptionId = crypto.keccak256(
      concat(proposalId,
      concat(accountId,
      concat(rewardType,
      concat(absAmount as ByteArray,
             signedAmount as ByteArray))))
    ).toHex()

    let redemption = new Entity()
    redemption.setString('redemptionId', redemptionId)
    redemption.setString('proposal', proposalId.toHex())
    redemption.setString('account', accountId.toHex())
    redemption.setString('type', rewardString)
    if (absAmount == null) {
      redemption.setI256('amount', signedAmount)
    } else {
      redemption.setU256('amount', absAmount)
    }
    redemption.setU256('time', time)
    store.set('Redemption', redemptionId, redemption as Entity)
}
