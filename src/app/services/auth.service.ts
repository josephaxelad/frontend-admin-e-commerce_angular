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

  constructor(private http: HttpClient) { }

  //Se connecter
  login(login : string,password: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(this.api+'/api/admin/login', {login : login , password : password})
      .subscribe(
        (authData : any)=>{
          this.token = authData.token;
          this.adminId = authData.adminId;
          this.isAuth$.next(true);
          resolve();
        },
        (error : any) => {
          reject(error.error);
        },

      );
    });
  }

  //Logout
  logout(){
    this.isAuth$.next(false);
    this.adminId = "";
    this.token = "";
  }
}
