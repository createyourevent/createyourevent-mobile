import { BaseEntity } from 'src/model/base-entity';
import { Point } from '../point/point.model';
import { User } from '../../../services/user/user.model';

export class UserPointAssociation implements BaseEntity {
  constructor(public id?: number, public date?: any, public points?: Point, public users?: User) {}
}
