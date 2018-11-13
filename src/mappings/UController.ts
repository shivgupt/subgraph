import 'allocator/arena'
export { allocate_memory }

import { Entity, Value, store, crypto, ByteArray } from '@graphprotocol/graph-ts'

import { RegisterScheme } from '../types/UController/UController'

import { createDao } from '../utils'

export function handleRegisterScheme(event: RegisterScheme): void {
  let dao = createDao(event.params._avatar);
  dao.setAddress('controllerAddress', event.address)
  store.set('DAO', event.params._avatar.toHex(), dao as Entity)
}
