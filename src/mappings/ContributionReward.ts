import 'allocator/arena'
export { allocate_memory }

import { ByteArray, store, } from '@graphprotocol/graph-ts'
import {
    NewContributionProposal,
    RedeemEther,
    RedeemExternalToken,
    RedeemNativeToken,
    RedeemReputation,
} from '../types/ContributionReward/ContributionReward'

import { Account, ProposalType, CRProposal, } from '../types/schema'

import { updateRedemption, getAccount, } from '../utils'

export function handleNewContributionProposal(event: NewContributionProposal): void {
    let proposalType = new ProposalType()
    proposalType.proposalId = event.params._proposalId.toHex()
    proposalType.proposalScheme = event.address
    proposalType.voteInterface = event.params._intVoteInterface
    store.set('ProposalType', event.params._proposalId.toHex(), proposalType)
    let account = getAccount(event.params._beneficiary, event.params._avatar)
    let crproposal = new CRProposal()
    crproposal.proposalId = event.params._proposalId.toHex()
    crproposal.contributionDescriptionHash = event.params._contributionDescription
    crproposal.reputationChange = event.params._reputationChange
    crproposal.externalToken = event.params._externalToken
    crproposal.beneficiary = account.accountId
    store.set('CRProposal', event.params._proposalId.toHex(), crproposal)
}

export function handleRedeemEther(event: RedeemEther): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 1
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'contributionRewardEth',
        event.params._amount,
        event.block.timestamp
    )
}

export function handleRedeemExternalToken(event: RedeemExternalToken): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 2
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'contributionRewardExternalToken',
        event.params._amount,
        event.block.timestamp
        )
}

export function handleRedeemNativeToken(event: RedeemNativeToken): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 3
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'contributionRewardNativeToken',
        event.params._amount,
        event.block.timestamp
    )
}

export function handleRedeemReputation(event: RedeemReputation): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 4
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'contributionRewardReputation',
        event.params._amount,
        event.block.timestamp
    )
}
