import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApiClient } from '../api/api-client.service';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const auth = { getToken: vi.fn(), clearSession: vi.fn() };
  const router = { navigate: vi.fn() };

  beforeEach(() => {
    auth.getToken.mockReset(); auth.clearSession.mockReset(); router.navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('adds a bearer token to protected API requests', () => {
    auth.getToken.mockReturnValue('jwt-ficticio');
    TestBed.inject(ApiClient).get<unknown[]>('/accounts').subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne('/api/accounts');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-ficticio');
    request.flush({ status: 'Success', isSuccess: true, errors: [], data: [] });
  });

  it('clears the session and redirects after a protected 401', () => {
    auth.getToken.mockReturnValue('jwt-ficticio');
    TestBed.inject(ApiClient).get('/dashboard').subscribe({ error: () => undefined });
    const request = TestBed.inject(HttpTestingController).expectOne('/api/dashboard');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.clearSession).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
