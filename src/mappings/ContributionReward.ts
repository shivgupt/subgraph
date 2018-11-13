import 'allocator/arena'
export { allocate_memory }

import { Entity, Address, U256, Bytes, Value, store, crypto, ByteArray } from '@graphprotocol/graph-ts'

import { NewContributionProposal, RedeemReputation, RedeemEther, RedeemNativeToken, RedeemExternalToken } from '../types/ContributionReward/ContributionReward'

import { concat, updateRedemption, createAccount } from '../utils'

const REWARD_TYPE_ETH = 0
const REWARD_TYPE_NATIVE_TOKEN = 1 
const REWARD_TYPE_BENEFICIARY_REPUTATION = 2
const REWARD_TYPE_EXTERNAL_TOKEN = 3

export function handleNewContributionProposal(event: NewContributionProposal): void {
    let proposalType = new Entity()
    proposalType.setString('proposalId', event.params._proposalId.toHex())
    proposalType.setAddress('proposalScheme', event.address)
    proposalType.setAddress('voteInterface', event.params._intVoteInterface)
    store.set('ProposalType', event.params._proposalId.toHex(), proposalType)

    let accountId = createAccount(event.params._beneficiary, event.params._avatar)

    let crproposal = new Entity()
    crproposal.setString('proposalId', event.params._proposalId.toHex())
    crproposal.setString('contributionDescriptionHash', event.params._contributionDescription.toHex())
    crproposal.setI256('reputationChange', event.params._reputationChange)
    crproposal.setAddress('externalToken', event.params._externalToken)
    crproposal.setString('beneficiary', accountId.toHex())
    store.set('CRProposal', event.params._proposalId.toHex(), crproposal)
}

export function handleRedeemReputation(event: RedeemReputation): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_BENEFICIARY_REPUTATION
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        null,
        event.params._amount,
        event.params._proposalId,
        rewardType as ByteArray,
        'beneficiaryReputation',
        event.block.timestamp
    )
}

export function handleRedeemEther(event: RedeemEther): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_ETH
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'beneficiaryEth',
        event.block.timestamp
    )
}

export function handleRedeemNativeToken(event: RedeemNativeToken): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_NATIVE_TOKEN
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'beneficiaryNativeToken',
        event.block.timestamp
    )
}

export function handleRedeemExternalToken(event: RedeemExternalToken): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_EXTERNAL_TOKEN
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'beneficiaryExternalToken',
        event.block.timestamp
        )
}
