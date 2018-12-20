import { ByteArray, store, } from '@graphprotocol/graph-ts'
import {
    ExecuteProposal,
    GPExecuteProposal,
    NewProposal,
    Redeem,
    RedeemDaoBounty,
    RedeemReputation,
    Stake as StakeEvent,
    VoteProposal,
} from '../types/GenesisProtocol/GenesisProtocol'

import { concat, updateRedemption, getAccount, } from '../utils'
import { Account, Proposal, Redemption, Stake, Vote, } from '../types/schema'

export function handleExecuteProposal(event: ExecuteProposal): void {
    let proposalId = event.params._proposalId.toHex()
    let proposal = new Proposal(proposalId)
    proposal.proposalId = proposalId
    proposal.dao = event.params._avatar.toHex()
    proposal.executionTime = event.block.timestamp
    proposal.decision = event.params._decision
    store.set('Proposal', proposal.proposalId, proposal)
}

export function handleGPExecuteProposal(event: GPExecuteProposal): void {
    let proposalId = event.params._proposalId.toHex()
    let proposal = new Proposal(proposalId)
    proposal.proposalId = proposalId
    proposal.state = event.parameters[1].value.toBigInt().toI32();
    store.set('Proposal', proposal.proposalId, proposal)
}

export function handleNewProposal(event: NewProposal): void {
    let account = getAccount(event.params._proposer, event.params._avatar)
    let proposalId = event.params._proposalId.toHex()
    let proposal = new Proposal(proposalId)
    proposal.proposalId = proposalId
    proposal.dao = event.params._avatar.toHex()
    proposal.proposer = account.accountId
    proposal.submittedTime = event.block.timestamp
    proposal.numOfChoices = event.params._numOfChoices
    proposal.paramsHash = event.params._paramsHash
    store.set('Proposal', proposal.proposalId, proposal)
}

export function handleRedeem (event: Redeem): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 5
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'genesisProtocolReputation',
        event.params._amount,
        event.block.timestamp
    )
}

export function handleRedeemDaoBounty (event: RedeemDaoBounty): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 6
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'genesisProtocolBounty',
        event.params._amount,
        event.block.timestamp
    )
}

export function handleRedeemReputation (event: RedeemReputation): void {
    let rewardType = new Uint8Array(1)
    rewardType[0] = 7
    updateRedemption(
        event.params._avatar,
        event.params._beneficiary,
        event.params._proposalId,
        rewardType as ByteArray,
        'genesisProtocolReputation',
        event.params._amount,
        event.block.timestamp
    )
}

export function handleStake(event: StakeEvent): void {
    let account = getAccount(event.params._staker, event.params._avatar)
    let stakeId = concat(event.params._proposalId, event.params._staker).toHex()
    let stake = new Stake(stakeId)
    stake.proposal = event.params._proposalId.toHex()
    stake.dao = event.params._avatar.toHex()
    stake.staker = account.accountId
    stake.prediction = event.params._vote
    stake.stakeAmount = event.params._amount
    stake.time = event.block.timestamp
    store.set('Stake', stakeId, stake)
}

// TODO: add reputation of voter at time of vote? Archive node needed?
export function handleVoteProposal(event: VoteProposal): void {
    let account = getAccount(event.params._voter, event.params._avatar)
    let voteId = concat(event.params._proposalId, event.params._voter).toHex()
    let vote = new Vote(voteId)
    vote.proposal = event.params._proposalId.toHex()
    vote.dao = event.params._avatar.toHex()
    vote.voter = account.accountId
    vote.voteOption = event.params._vote
    vote.time = event.block.timestamp
    store.set('Vote', voteId, vote)
}
