import { BaseEntity } from 'src/model/base-entity';
import { ChipsCollectionChips } from '../chips-collection-chips/chips-collection-chips.model';

export class Chips implements BaseEntity {
  constructor(
    public id?: number,
    public points?: number,
    public website?: string,
    public x?: number,
    public y?: number,
    public imageContentType?: string,
    public image?: any,
    public color?: string,
    public chipsCollectionChips?: ChipsCollectionChips[]
  ) {}
}
