import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api : string = environment.api;
  isAuth$ = new BehaviorSubject<boolean>(false);
  token!: string;
  adminId!: string;

  constructor(private http: HttpClient) {
    this.verifyAuth();
   }

  //Se connecter
  login(login : string,password: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(this.api+'admin/login', {login : login , password : password})
      .subscribe(
        (authData : any)=>{
          this.token = authData.token;
          this.adminId = authData.adminId;
          if (typeof(localStorage) !== "undefined") {
            localStorage.setItem('token', JSON.stringify(this.token));
            localStorage.setItem('id' ,  JSON.stringify(this.adminId));
          }
          this.isAuth$.next(true);
          resolve();
        },
        (error : any) => {
          reject(error.error);
        },

      );
    });
  }

  //Vérifier si il y'a un administrateur connecté
  verifyAuth(){
    if (typeof(localStorage) !== "undefined") {
      const token = JSON.parse(localStorage.getItem('token')!);
      const idAdmin = JSON.parse(localStorage.getItem('id')!);
      if (token && idAdmin) {
        this.isAuth$.next(true);
      }
      else {
        this.logout()
      }
    }else{
      this.logout();
    }
  }

  //Logout
  logout(){
    this.isAuth$.next(false);
    this.adminId = "";
    this.token = "";
    if (typeof(localStorage) !== "undefined") {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
    }
  }
}
