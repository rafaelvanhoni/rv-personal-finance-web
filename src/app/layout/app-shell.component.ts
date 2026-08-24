import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatDividerModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav #sidenav class="sidebar" [mode]="isMobile() ? 'over' : 'side'" [opened]="!isMobile()">
        <a class="brand" routerLink="/dashboard" (click)="closeOnMobile()" aria-label="Ir para o dashboard">
          <span class="brand-mark">RV</span>
          <span><strong>Personal Finance</strong><small>Seu dinheiro, mais claro</small></span>
        </a>
        <nav aria-label="Navegação principal">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" (click)="closeOnMobile()">
              <span class="nav-mark">{{ item.mark }}</span>{{ item.label }}
            </a>
          }
        </nav>
        <div class="sidebar-footer">
          <mat-divider />
          <button mat-button (click)="logout()"><span class="nav-mark">↗</span>Sair</button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          @if (isMobile()) { <button mat-button class="menu-button" (click)="sidenav.toggle()" aria-label="Abrir menu">Menu</button> }
          <span class="spacer"></span>
          @if (email) { <span class="user-email">{{ email }}</span> }
          <span class="avatar">{{ initials }}</span>
        </mat-toolbar>
        <main><router-outlet /></main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell { min-height: 100vh; background: #eef3ef; }
    .sidebar { width: 276px; padding: 24px 16px 18px; background: var(--brand-dark); color: #fff; border: 0; }
    .brand { display: flex; align-items: center; gap: 12px; margin: 0 8px 36px; color: #fff; text-decoration: none; }
    .brand-mark { display: grid; width: 44px; height: 44px; place-items: center; flex: 0 0 auto; border-radius: 13px; background: var(--accent); color: var(--brand-dark); font-weight: 900; letter-spacing: -.05em; }
    .brand strong, .brand small { display: block; }
    .brand strong { font-size: 1.05rem; }
    .brand small { margin-top: 3px; color: #a9c0b7; font-size: .72rem; }
    nav { display: grid; gap: 6px; }
    nav a, .sidebar-footer button { display: flex; width: 100%; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: #bed0c9; text-decoration: none; font-weight: 650; }
    nav a:hover, nav a.active, .sidebar-footer button:hover { background: rgba(213,255,120,.12); color: #fff; }
    nav a.active { box-shadow: inset 3px 0 var(--accent); }
    .nav-mark { display: inline-grid; width: 26px; place-items: center; color: var(--accent); font-weight: 900; }
    .sidebar-footer { position: absolute; right: 16px; bottom: 18px; left: 16px; }
    .sidebar-footer mat-divider { margin-bottom: 12px; border-color: rgba(255,255,255,.1); }
    .topbar { position: sticky; z-index: 10; top: 0; height: 68px; padding: 0 30px; background: rgba(255,255,255,.9); border-bottom: 1px solid var(--line); backdrop-filter: blur(12px); }
    .spacer { flex: 1; }
    .user-email { max-width: 300px; overflow: hidden; color: var(--muted); font-size: .84rem; text-overflow: ellipsis; white-space: nowrap; }
    .avatar { display: grid; width: 36px; height: 36px; margin-left: 12px; place-items: center; border-radius: 50%; background: var(--brand); color: #fff; font-size: .75rem; font-weight: 800; }
    .menu-button { color: var(--brand); font-weight: 750; }
    main { min-height: calc(100vh - 68px); }
    @media (max-width: 700px) { .topbar { height: 60px; padding: 0 16px; } .user-email { display: none; } main { min-height: calc(100vh - 60px); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  @ViewChild('sidenav') private sidenav?: MatSidenav;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly isMobile = toSignal(inject(BreakpointObserver).observe(Breakpoints.Handset).pipe(map((state) => state.matches)), { initialValue: false });
  readonly email = this.auth.getEmail();
  readonly initials = this.email ? this.email.slice(0, 2).toUpperCase() : 'RV';
  readonly navigation = [
    { path: '/dashboard', label: 'Dashboard', mark: '⌂' },
    { path: '/accounts', label: 'Contas', mark: '▣' },
    { path: '/categories', label: 'Categorias', mark: '◇' },
    { path: '/transactions', label: 'Transações', mark: '⇄' },
  ];

  closeOnMobile(): void { if (this.isMobile()) void this.sidenav?.close(); }
  logout(): void { this.auth.clearSession(); void this.router.navigate(['/login']); }
}
