export class User {
  _id? : string;
  firstname!: string;
  lastname!: string;
  isAdmin?: boolean;
  email!: string;
  sex!: number;
  creationDate!: Date;
}
