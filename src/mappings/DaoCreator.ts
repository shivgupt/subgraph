import 'allocator/arena'
export { allocate_memory }

import { Entity, Value, store, crypto, ByteArray } from '@graphprotocol/graph-ts'

import { NewOrg } from '../types/DaoCreator/DaoCreator'
import { createDao } from '../utils'

export function handleNewOrg(event: NewOrg): void {
    createDao(event.params._avatar);
}
