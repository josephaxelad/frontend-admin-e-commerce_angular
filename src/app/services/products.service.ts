import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products!: Product[];
  products$ = new BehaviorSubject<Product[]>([]);

  constructor(private _http : HttpClient,private _authServices : AuthService) {
    this.getProducts();
  }

  /**
   * Créer un produit
   * @param product
   * @param productImage
   * @returns
   */
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
          switch (error.status) {
            case 401:
              this._authServices.reSignIn()
              break;

            default:
              reject(error);
          }
          console.log(error)


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
        switch (error.status) {
          case 401:
            this._authServices.logout();
            break;

          default:
            ;
        }
        console.log(error)
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
          switch (error.status) {
            case 401:
              this._authServices.reSignIn()
              break;

            default:
              reject(error);
          }
          console.log(error)
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
          switch (error.status) {
            case 401:
              this._authServices.reSignIn()
              break;

            default:
              reject(error);
          }
          console.log(error)
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
