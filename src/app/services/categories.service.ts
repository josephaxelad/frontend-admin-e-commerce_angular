import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  categories!: Category[];
  categories$ = new BehaviorSubject<Category[]>([]);

  constructor(private _http : HttpClient,private _authServices : AuthService) {
    this.getCategories();
  }

  /**
   * Ajoute une catégorie
   * @param category
   */
  addCategory(category : Category) {
    return new Promise((resolve, reject) => {
      this._http.post(environment.api+'category/create',category).subscribe(
        (res) => {
          this.getCategories(),
          resolve(res);
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
   * Récupères les catégories
   */
  getCategories(){
      this._http.get(environment.api+'category/getVeryAll').subscribe(
        (categories : any) => {
          this.categories = categories ;
          this.emitCategories();
        },
        (error) => {
          switch (error.status) {
            case 401:
              this._authServices.logout()
              break;
          }
          console.log(error)
        }
      );
  }

  /**
   * Supprimer une catégorie
   * @param id
   */
  deleteCategory(id : string){
    return new Promise<void>((resolve, reject) => {
      this._http.delete(environment.api+"category/deleteHard/"+id).subscribe(
        (res)=>{
          this.getCategories(),
          resolve()
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
   * Modifie la catégorie
   * @param category
   */
  editCategory(category : Category){
    return new Promise<void>((resolve, reject) => {
      this._http.put(environment.api+"category/modify/"+category._id,category).subscribe(
        (res)=>{
          this.getCategories(),
          resolve()
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
   * émettre des catégories
   */
  emitCategories(){
    this.categories$.next(this.categories)
  }


}
