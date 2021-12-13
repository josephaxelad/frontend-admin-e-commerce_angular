import { User } from "./user";

export class Customer {
  _id? : string;
  user!: User;
  password?: string;
  isDeleted? : boolean;
  isDisabled? : boolean;
}
