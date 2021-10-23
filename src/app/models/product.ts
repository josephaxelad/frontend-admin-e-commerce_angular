import { Category } from "./category";

export class Product {
  _id? : string;
  name!: string;
  description! : string;
  isHidden : boolean = false;
  isDeleted : boolean = false;
  inStock : boolean = false;
  stock : number = 0;
  inTrend : boolean = false;
  inPromotion : boolean = false;
  promotionRate : number = 0;
  promotionPrice : number = 0;
  category? : Category ;
  categoryId? : string;
  categoryName? : String;
  weight : number = 0 ;
  picture? : string;
  imageUrl? : String;
  price : number = 0;
  tags? : string[];
}