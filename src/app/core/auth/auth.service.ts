import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiClient } from '../api/api-client.service';
import { LoginRequest, LoginResponse, RegisteredUser, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'rv-finance-token';
  private readonly authenticatedState = signal(this.hasValidStoredToken());

  readonly isAuthenticated = this.authenticatedState.asReadonly();

  constructor(private readonly api: ApiClient) {}

  login(request: LoginRequest) {
    return this.api.post<LoginResponse>('/auth/login', request).pipe(
      tap(({ token }) => {
        sessionStorage.setItem(this.tokenKey, token);
        this.authenticatedState.set(true);
      }),
    );
  }

  register(request: RegisterRequest) {
    return this.api.post<RegisteredUser>('/auth/register', request);
  }

  getToken(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token || this.isExpired(token)) {
      this.clearSession();
      return null;
    }
    return token;
  }

  getEmail(): string {
    const payload = this.decodePayload(this.getToken());
    return typeof payload?.['email'] === 'string' ? payload['email'] : '';
  }

  clearSession(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.authenticatedState.set(false);
  }

  private hasValidStoredToken(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token || this.isExpired(token)) {
      sessionStorage.removeItem(this.tokenKey);
      return false;
    }
    return true;
  }

  private isExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    return typeof payload?.['exp'] !== 'number' || payload['exp'] * 1000 <= Date.now();
  }

  private decodePayload(token: string | null): Record<string, unknown> | null {
    if (!token) return null;
    try {
      const encoded = token.split('.')[1];
      if (!encoded) return null;
      const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalized)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
