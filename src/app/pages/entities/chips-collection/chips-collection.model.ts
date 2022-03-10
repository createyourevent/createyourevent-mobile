import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { ChipsCollectionChips } from '../chips-collection-chips/chips-collection-chips.model';

export class ChipsCollection implements BaseEntity {
  constructor(public id?: number, public user?: User, public chipsCollectionChips?: ChipsCollectionChips[]) {}
}
