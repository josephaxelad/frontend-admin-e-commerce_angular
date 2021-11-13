import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products!: Product[];
  products$ = new BehaviorSubject<Product[]>([]);

  constructor(private _http : HttpClient) {
    this.getProducts();
  }

  createProduct(product: Product, productImage: File) {
    return new Promise((resolve, reject) => {
      const productData = new FormData();
      productData.append('product', JSON.stringify(product));
      productData.append('image', productImage);
      this._http.post(environment.api+'product/create',productData).subscribe(
        (response) => {
          resolve(response);
          this.getProducts();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Récupères les produits
   */
   getProducts(){
    this._http.get(environment.api+'product/getAll').subscribe(
      (products : any) => {
        this.products = products ;
        this.emitProducts();
      },
      (error) => {
        console.log(error.error)
      }
    );
  }

  /**
   * Modifie le produit
   * @param product
   * @param productImage
   */
  editProduct(product: Product, productImage: File){
    return new Promise<any>((resolve, reject) => {
      const productData = new FormData();
      productData.append('product', JSON.stringify(product));
      productData.append('image', productImage);
      this._http.put(environment.api+"product/modify/"+product._id,productData).subscribe(
        (response) => {
          resolve(response);
          this.getProducts();
        },
        (error) => {
          reject(error);
        }
      )
    })
  }

  /**
   * Supprime un produit
   * @param id
   */
  deleteProduct(id : string){
    return new Promise<any>((resolve, reject) => {
      this._http.put(environment.api+"product/delete/"+id,"").subscribe(
        (response)=>{
          resolve(response)
          this.getProducts();
        },
        (error)=>{
          reject(error)
        }
      )
    })
  }

  /**
   * Archive ou désarchive un élément
   * @param isHidden
   * @param id
   * @returns
   */
  isHidden(isHidden : boolean,id : string){
    return new Promise<any>((resolve, reject) => {
      this._http.put(environment.api+"product/isHidden/"+id,{isHidden : isHidden}).subscribe(
        (response)=>{
          resolve(response);
          this.getProducts();
        },
        (error)=>{
          reject(error)
        }
      )
    })
  }

  /**
   * Rend visible ou invisible un produit
   * @param isVisible
   * @param id
   * @returns
   */
  isVisible(isVisible : boolean,id : string){
    return new Promise<any>((resolve, reject) => {
      this._http.put(environment.api+"product/isVisible/"+id,{isVisible : isVisible}).subscribe(
        (response)=>{
          resolve(response)
        },
        (error)=>{
          reject(error)
        }
      )
    })
  }

  /**
   * émettre des catégories
   */
   emitProducts(){
    this.products$.next(this.products)
  }

}
