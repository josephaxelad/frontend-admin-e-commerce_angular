export class Category {
  _id? : string;
  name!: string;
  isParent! : boolean;
  idParent! : String;
  parentName? : String;
  createdBy? : string;
  creationDate? : Date;
}
