import { BaseEntity } from 'src/model/base-entity';

export class ChipsAdmin implements BaseEntity {
  constructor(public id?: number, public gameActive?: boolean) {
    this.gameActive = false;
  }
}
