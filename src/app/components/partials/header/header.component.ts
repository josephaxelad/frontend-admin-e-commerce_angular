import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isAuth: boolean = false;
  private isAuthSub!: Subscription;

  constructor(private authService : AuthService,private _router : Router) { }

  ngOnInit(): void {
    //Vérifier si un utilisateur est connecté
    this.isAuthSub = this.authService.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
        //Diriger vers login s'il n'a pas d'utilisateurs connectés
        if (!auth) {
          this.logout()
        }
      }
    );
  }

  //Se déconnecter
  logout(){
    this._router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.isAuthSub.unsubscribe();
  }


}
