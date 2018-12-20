import { NewOrg } from '../types/DaoCreator/DaoCreator'
import { getDao } from '../utils'

export function handleNewOrg(event: NewOrg): void {
    getDao(event.params._avatar);
}
