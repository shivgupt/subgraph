import 'allocator/arena'
export { allocate_memory }

import { Entity, Address, U256, Bytes, Value, store, crypto, ByteArray } from '@graphprotocol/graph-ts'

import { GPExecuteProposal, Stake, Redeem, RedeemDaoBounty, RedeemReputation,NewProposal, ExecuteProposal, VoteProposal } from '../types/GenesisProtocol/GenesisProtocol'

import { concat, updateRedemption, createAccount } from '../utils'

const REWARD_TYPE_GP_REP = 4
const REWARD_TYPE_GP_GEN = 5
const REWARD_TYPE_GP_BOUNTY = 6

export function handleNewProposal(event: NewProposal): void {
    let accountId = createAccount(event.params._proposer, event.params._avatar)
    let proposal = new Entity()
    proposal.setString('proposalId', event.params._proposalId.toHex())
    proposal.setAddress('dao', event.params._avatar)
    proposal.setString('proposer', accountId.toHex())
    proposal.setU256('submittedTime', event.block.timestamp)
    proposal.setU256('numOfChoices', event.params._numOfChoices)
    proposal.setBytes('paramsHash', event.params._paramsHash)
    store.set('Proposal', event.params._proposalId.toHex(), proposal as Entity)
}

// TODO: add reputation of voter at time of vote
export function handleVoteProposal(event: VoteProposal): void {
    let accountId = createAccount(event.params._voter, event.params._avatar)
    let vote = new Entity()
    let uniqueId = concat(event.params._proposalId, event.params._voter).toHex()
    vote.setString('proposal', event.params._proposalId.toHex())
    vote.setAddress('dao', event.params._avatar)
    vote.setString('voter', accountId.toHex())
    vote.setU256('voteOption', event.params._vote)
    vote.setU256('time', event.block.timestamp)
    store.set('Vote', uniqueId, vote as Entity)
}

export function handleStake(event: Stake): void {
    let accountId = createAccount(event.params._staker, event.params._avatar)
    let stake = new Entity()
    let uniqueId = crypto.keccak256(concat(event.params._proposalId, event.params._staker)).toHex()
    stake.setString('proposal', event.params._proposalId.toHex())
    stake.setAddress('dao', event.params._avatar)
    stake.setString('staker', accountId.toHex())
    stake.setU256('prediction', event.params._vote)
    stake.setU256('stakeAmount', event.params._amount)
    stake.setU256('time', event.block.timestamp)
    store.set('Stake', uniqueId, stake as Entity)
}

export function handleGPExecuteProposal (event: GPExecuteProposal): void {
    //let proposal = new Entity()
    //proposal.setInt('state', event.params._executionState as u32)
    //store.set('Proposal', event.params._proposalId.toHex(), proposal as Entity)
}

export function handleExecuteProposal(event: ExecuteProposal): void {
    let proposal = new Entity()
    proposal.setString('proposalId', event.params._proposalId.toHex())
    proposal.setAddress('dao', event.params._avatar)
    proposal.setU256('executionTime', event.block.timestamp)
    proposal.setU256('decision', event.params._decision)
    store.set('Proposal', event.params._proposalId.toHex(), proposal as Entity)
}

export function handleRedeem (event: Redeem): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_GP_GEN
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'gpGen',
        event.block.timestamp
        )
}

export function handleRedeemDaoBounty (event: RedeemDaoBounty): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_GP_BOUNTY
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'gpBounty',
        event.block.timestamp
        )
}

export function handleRedeemReputation (event: RedeemReputation): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = REWARD_TYPE_GP_REP
    updateRedemption(
        event.params._beneficiary,
        event.params._avatar,
        event.params._amount,
        null,
        event.params._proposalId,
        rewardType as ByteArray,
        'gpRep',
        event.block.timestamp
        )
}
