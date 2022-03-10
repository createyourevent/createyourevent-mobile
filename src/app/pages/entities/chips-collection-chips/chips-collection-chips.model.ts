import { BaseEntity } from 'src/model/base-entity';
import { ChipsCollection } from '../chips-collection/chips-collection.model';
import { Chips } from '../chips/chips.model';

export class ChipsCollectionChips implements BaseEntity {
  constructor(public id?: number, public chipsCollection?: ChipsCollection, public chips?: Chips) {}
}
