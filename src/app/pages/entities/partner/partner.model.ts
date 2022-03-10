import { BaseEntity } from 'src/model/base-entity';

export class Partner implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public phone?: string,
    public logoContentType?: string,
    public logo?: any,
    public mail?: string,
    public webaddress?: string,
    public sponsorshipAmount?: number,
    public active?: boolean
  ) {
    this.active = false;
  }
}
