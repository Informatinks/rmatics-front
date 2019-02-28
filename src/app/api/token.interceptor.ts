import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return [environment.apiUrl].some(domain => request.url.includes(domain))
      ? this.authService.provideHeaders()
        .pipe(flatMap(headers => {
          request = request.clone({ setHeaders: headers });
          return next.handle(request);
        }))
      : next.handle(request);
  }
}