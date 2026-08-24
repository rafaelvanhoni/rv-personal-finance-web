import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();
  const isAuthRequest = request.url.includes('/auth/');
  const authenticatedRequest = token && !isAuthRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (typeof error === 'object' && error !== null && 'status' in error && error.status === 401 && !isAuthRequest) {
        auth.clearSession();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
