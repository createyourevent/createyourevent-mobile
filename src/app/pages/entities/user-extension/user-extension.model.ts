import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class UserExtension implements BaseEntity {
  constructor(
    public id?: number,
    public address?: string,
    public phone?: string,
    public loggedIn?: boolean,
    public points?: number,
    public user?: User
  ) {
    this.loggedIn = false;
  }
}
