import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public isAuth: boolean = false;
  private isAuthSub!: Subscription;
  logo : string = environment.logo;
  resignIn!: boolean;


  constructor(private authService : AuthService,private router : Router) { }

  ngOnInit(): void {

    // Afficher ou Masquer modal de reconnexiont
    this.authService.isReSignIn$.subscribe(
      (isResignIn)=>{
        if (isResignIn) {
          this.resignIn = true;
        } else {
          this.resignIn = false;
        }
      }
    )

    //Vérifier si un utilisateur est connecté
    this.isAuthSub = this.authService.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
      }
    );
  }

  //Se déconnecter
  logout(){
    this.authService.logout();
  }



}
