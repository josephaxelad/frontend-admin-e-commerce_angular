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


  constructor(private authService : AuthService,private router : Router) {

    // $('[data-widget="treeview"]').Treeview('init');


   }

  ngOnInit(): void {

    // $(document).ready(() => {
    //   $('[data-widget="treeview"]').Treeview('init');
    // });



    //Vérifier si un utilisateur est connecté
    this.isAuthSub = this.authService.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
        // Activer treeview si un utlisateur est connecté *
        // if (auth == true) {
        //   setTimeout(() => {
        //     $('[data-widget="treeview"]').Treeview('init');
        //   }, 1);
        // }
      }
    );
  }

  //Se déconnecter
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ngAfterViewInit(): void{
  //   $('[data-widget="treeview"]').Treeview('init');
  // }

  // ngAfterViewInit(): void { $('[data-widget="treeview"]').each(function() { AdminLte.Treeview._jQueryInterface.call($(this), 'init'); }); }

}
