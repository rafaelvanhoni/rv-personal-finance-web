import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ApiError } from '../../core/errors/api-error';
import { applyApiFieldErrors, controlError } from '../../core/errors/form-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <main class="auth-page">
      <section class="auth-intro">
        <a class="brand" routerLink="/login"><span>RV</span> Personal Finance</a>
        <div>
          <p class="intro-eyebrow">COMECE PELO ESSENCIAL</p>
          <h1>Sua vida financeira<br>em um só lugar.</h1>
          <p>Cadastre-se para acompanhar saldos, receitas e despesas com tranquilidade.</p>
        </div>
        <small>Simples para começar, útil todos os dias.</small>
      </section>
      <section class="auth-form-wrap">
        <mat-card appearance="outlined" class="auth-card">
          <mat-card-header><mat-card-title>Criar conta</mat-card-title><mat-card-subtitle>Preencha seus dados para começar.</mat-card-subtitle></mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="name" autocomplete="name">
                @if (controlError(form, 'name')) { <mat-error>{{ controlError(form, 'name') }}</mat-error> }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>E-mail</mat-label>
                <input matInput type="email" formControlName="email" autocomplete="email">
                @if (controlError(form, 'email')) { <mat-error>{{ controlError(form, 'email') }}</mat-error> }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <input matInput type="password" formControlName="password" autocomplete="new-password">
                @if (controlError(form, 'password')) { <mat-error>{{ controlError(form, 'password') }}</mat-error> }
              </mat-form-field>
              @if (errorMessage()) { <p class="form-error" role="alert">{{ errorMessage() }}</p> }
              <button mat-flat-button type="submit" [disabled]="submitting()">{{ submitting() ? 'Criando conta…' : 'Criar conta' }}</button>
            </form>
          </mat-card-content>
          <mat-card-footer>Já possui uma conta? <a routerLink="/login">Entrar</a></mat-card-footer>
        </mat-card>
      </section>
    </main>
  `,
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly controlError = controlError;
  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set('');
    this.auth.register(this.form.getRawValue()).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => void this.router.navigate(['/login'], { queryParams: { registered: true } }),
      error: (error: ApiError) => { applyApiFieldErrors(this.form, error); this.errorMessage.set(error.message); },
    });
  }
}
