import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this._authService.token;
    const token = authToken ? authToken : JSON.parse(localStorage.getItem('token')!) ;
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });
    return next.handle(newRequest);
  }
}
