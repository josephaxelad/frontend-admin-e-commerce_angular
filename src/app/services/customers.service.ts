import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customers!: Customer[];
  customers$ = new BehaviorSubject<Customer[]>([]);

  constructor(private _http : HttpClient,private _authServices : AuthService) {
    this.getCustomers()
  }

  /**
   * Récupères les clients
   */
   getCustomers(){
    this._http.get(environment.api+'user/getAll').subscribe(
      (customers : any) => {
        this.customers = customers;
        console.log(this.customers)
        this.emitCustomers();
      },
      (error) => {
        switch (error.status) {
          case 401:
            this._authServices.reSignIn()
            break;
        }
        // console.log(error)
      }
    );
  }

    /**
   * Archive ou désarchive un élément
   * @param isDisabled
   * @param id
   * @returns
   */
     isDisabled(isDisabled : boolean,id : string){
      return new Promise<any>((resolve, reject) => {
        this._http.put(environment.api+"user/isDisabled/"+id,{isDisabled : isDisabled}).subscribe(
          (response)=>{
            resolve(response);
            this.getCustomers();
          },
          (error)=>{
            switch (error.status) {
              case 401:
                this._authServices.reSignIn()
                break;

              default:
                reject(error);
            }
          }
        )
      })
    }

  /**
   * émettre des catégories
   */
   emitCustomers(){
    this.customers$.next(this.customers)
  }

}
