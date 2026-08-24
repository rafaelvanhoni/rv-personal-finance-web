import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ApiError } from '../../core/errors/api-error';
import { applyApiFieldErrors, controlError } from '../../core/errors/form-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <main class="auth-page">
      <section class="auth-intro">
        <a class="brand" routerLink="/login"><span>RV</span> Personal Finance</a>
        <div>
          <p class="intro-eyebrow">FINANÇAS SEM RUÍDO</p>
          <h1>Veja seu dinheiro<br>com mais clareza.</h1>
          <p>Contas, categorias e movimentações reunidas em uma experiência simples.</p>
        </div>
        <small>Controle pessoal, decisões melhores.</small>
      </section>
      <section class="auth-form-wrap">
        <mat-card appearance="outlined" class="auth-card">
          <mat-card-header><mat-card-title>Boas-vindas</mat-card-title><mat-card-subtitle>Entre para acessar seu painel financeiro.</mat-card-subtitle></mat-card-header>
          <mat-card-content>
            @if (registered()) { <div class="success-message">Cadastro concluído. Agora você já pode entrar.</div> }
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <mat-form-field appearance="outline">
                <mat-label>E-mail</mat-label>
                <input matInput type="email" formControlName="email" autocomplete="email">
                @if (controlError(form, 'email')) { <mat-error>{{ controlError(form, 'email') }}</mat-error> }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <input matInput type="password" formControlName="password" autocomplete="current-password">
                @if (controlError(form, 'password')) { <mat-error>{{ controlError(form, 'password') }}</mat-error> }
              </mat-form-field>
              @if (errorMessage()) { <p class="form-error" role="alert">{{ errorMessage() }}</p> }
              <button mat-flat-button type="submit" [disabled]="submitting()">{{ submitting() ? 'Entrando…' : 'Entrar' }}</button>
            </form>
          </mat-card-content>
          <mat-card-footer>Primeiro acesso? <a routerLink="/register">Crie sua conta</a></mat-card-footer>
        </mat-card>
      </section>
    </main>
  `,
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly registered = signal(this.route.snapshot.queryParamMap.get('registered') === 'true');
  readonly controlError = controlError;
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.auth.getToken()) void this.router.navigate(['/dashboard']);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set('');
    this.auth.login(this.form.getRawValue()).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard'),
      error: (error: ApiError) => { applyApiFieldErrors(this.form, error); this.errorMessage.set(error.message); },
    });
  }
}
