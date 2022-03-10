import { BaseEntity } from 'src/model/base-entity';

export class AdminFeesPrice implements BaseEntity {
  constructor(
    public id?: number,
    public feesOrganisator?: number,
    public feesSupplier?: number,
    public feesService?: number,
    public feesOrganizations?: number
  ) {}
}
