export interface IUser {
  id?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
  loggedIn?: boolean;
  points?: number;
}

export class User implements IUser {
  constructor(
    public id: string,
    public login: string,
    public firstName: string,
    public lastName: string,
    public address: string,
    public phone: string,
    public email: string,
    public loggedIn: boolean,
    public points: number
  ) {}
}
