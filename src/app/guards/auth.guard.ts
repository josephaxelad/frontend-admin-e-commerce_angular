import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //Vérifier si il y'a un administrateur connecté
    if (typeof(localStorage) !== "undefined") {
      const token = JSON.parse(localStorage.getItem('token')!);
      const idAdmin = JSON.parse(localStorage.getItem('id')!);
      if (token && idAdmin) {
        return true;
      }
      else {
        this.router.navigate(['/login']);
      return false;
      }
    }else{
      return false;
    }


  }

}
