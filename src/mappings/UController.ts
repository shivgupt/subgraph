import 'allocator/arena'
export { allocate_memory }

import { store, } from '@graphprotocol/graph-ts'
import { DAO, } from '../types/schema'
import { RegisterScheme } from '../types/UController/UController'
import { getDao } from '../utils'

export function handleRegisterScheme(event: RegisterScheme): void {
  let dao = getDao(event.params._avatar);
  dao.controllerAddress = event.address
  store.set('DAO', event.params._avatar.toHex(), dao)
}
