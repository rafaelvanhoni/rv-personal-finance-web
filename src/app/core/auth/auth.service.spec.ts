import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClient } from '../api/api-client.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const api = { post: vi.fn() };

  beforeEach(() => {
    sessionStorage.clear();
    api.post.mockReset();
    TestBed.configureTestingModule({ providers: [AuthService, { provide: ApiClient, useValue: api }] });
  });

  it('stores the JWT in sessionStorage after login', () => {
    const token = jwt({ email: 'pessoa@exemplo.com', exp: Math.floor(Date.now() / 1000) + 3600 });
    api.post.mockReturnValue(of({ token }));
    const service = TestBed.inject(AuthService);

    service.login({ email: 'pessoa@exemplo.com', password: 'senha-ficticia' }).subscribe();

    expect(service.getToken()).toBe(token);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getEmail()).toBe('pessoa@exemplo.com');
  });

  it('removes an expired JWT from the session', () => {
    sessionStorage.setItem('rv-finance-token', jwt({ exp: 1 }));
    const service = TestBed.inject(AuthService);

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});

function jwt(payload: object): string {
  return `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
}
