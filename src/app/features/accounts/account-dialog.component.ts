import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/errors/api-error';
import { applyApiFieldErrors, controlError } from '../../core/errors/form-error';
import { Account } from './account.models';
import { AccountsService } from './accounts.service';

export interface AccountDialogData { account?: Account; }

@Component({
  selector: 'app-account-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.account ? 'Editar conta' : 'Nova conta' }}</h2>
    <mat-dialog-content>
      <form id="account-form" class="dialog-form" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline"><mat-label>Nome</mat-label><input matInput formControlName="name" maxlength="80" autocomplete="off">@if (controlError(form, 'name')) { <mat-error>{{ controlError(form, 'name') }}</mat-error> }</mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Saldo inicial</mat-label><span matTextPrefix>R$&nbsp;</span><input matInput type="number" min="0" step="0.01" formControlName="initialBalance">@if (controlError(form, 'initialBalance')) { <mat-error>{{ controlError(form, 'initialBalance') }}</mat-error> }</mat-form-field>
        @if (errorMessage()) { <p class="dialog-error" role="alert">{{ errorMessage() }}</p> }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions"><button mat-button mat-dialog-close [disabled]="saving()">Cancelar</button><button mat-flat-button type="submit" form="account-form" [disabled]="saving()">{{ saving() ? 'Salvando…' : 'Salvar' }}</button></mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDialogComponent {
  readonly data = inject<AccountDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AccountDialogComponent>);
  private readonly service = inject(AccountsService);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly controlError = controlError;
  readonly form = this.fb.group({
    name: [this.data.account?.name ?? '', [Validators.required, Validators.maxLength(80)]],
    initialBalance: [this.data.account?.initialBalance ?? 0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true); this.errorMessage.set('');
    const request = this.data.account
      ? this.service.update(this.data.account.id, this.form.getRawValue())
      : this.service.create(this.form.getRawValue());
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (account) => this.dialogRef.close(account),
      error: (error: ApiError) => { applyApiFieldErrors(this.form, error); this.errorMessage.set(error.message); },
    });
  }
}
