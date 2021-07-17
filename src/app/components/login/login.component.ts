import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(private authService : AuthService,private router: Router,private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    //Initialiser le formulaire login
    this.loginForm = this.formBuilder.group({
      login : ['',[Validators.required]],
      password : ['',[Validators.required]],
    });
  }

  //Se connecter
  login(){
    const login = this.loginForm.get('login')?.value ;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(login,password)
    .then(()=>{
        this.router.navigate(['/home']);
      }
    )
    .catch((error)=>{
      console.log(error);
      this.errorMessage = error.error;
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    })
  }

}
