import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/errors/api-error';
import { applyApiFieldErrors, controlError } from '../../core/errors/form-error';
import { Account } from '../accounts/account.models';
import { Category } from '../categories/category.models';
import { Transaction, TransactionInput, TransactionType } from './transaction.models';
import { TransactionsService } from './transactions.service';

export interface TransactionDialogData { transaction?: Transaction; accounts: Account[]; categories: Category[]; }

@Component({
  selector: 'app-transaction-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.transaction ? 'Editar transação' : 'Nova transação' }}</h2>
    <mat-dialog-content><form id="transaction-form" class="dialog-form transaction-form" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="wide"><mat-label>Descrição</mat-label><input matInput formControlName="description" maxlength="100" autocomplete="off">@if (controlError(form, 'description')) { <mat-error>{{ controlError(form, 'description') }}</mat-error> }</mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Valor</mat-label><span matTextPrefix>R$&nbsp;</span><input matInput type="number" min="0.01" step="0.01" formControlName="amount">@if (controlError(form, 'amount')) { <mat-error>{{ controlError(form, 'amount') }}</mat-error> }</mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Tipo</mat-label><mat-select formControlName="type">@for (type of types; track type.value) { <mat-option [value]="type.value">{{ type.label }}</mat-option> }</mat-select>@if (controlError(form, 'type')) { <mat-error>{{ controlError(form, 'type') }}</mat-error> }</mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Data</mat-label><input matInput type="date" formControlName="transactionDate">@if (controlError(form, 'transactionDate')) { <mat-error>{{ controlError(form, 'transactionDate') }}</mat-error> }</mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Conta</mat-label><mat-select formControlName="accountId">@for (account of data.accounts; track account.id) { <mat-option [value]="account.id">{{ account.name }}</mat-option> }</mat-select>@if (controlError(form, 'accountId')) { <mat-error>{{ controlError(form, 'accountId') }}</mat-error> }</mat-form-field>
      <mat-form-field appearance="outline" class="wide"><mat-label>Categoria</mat-label><mat-select formControlName="categoryId">@for (category of data.categories; track category.id) { <mat-option [value]="category.id">{{ category.name }}</mat-option> }</mat-select>@if (controlError(form, 'categoryId')) { <mat-error>{{ controlError(form, 'categoryId') }}</mat-error> }</mat-form-field>
      @if (errorMessage()) { <p class="dialog-error wide" role="alert">{{ errorMessage() }}</p> }
    </form></mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions"><button mat-button mat-dialog-close [disabled]="saving()">Cancelar</button><button mat-flat-button type="submit" form="transaction-form" [disabled]="saving()">{{ saving() ? 'Salvando…' : 'Salvar' }}</button></mat-dialog-actions>
  `,
  styles: [`.transaction-form { grid-template-columns: 1fr 1fr; } .wide { grid-column: 1 / -1; } @media(max-width:560px) { .transaction-form { grid-template-columns: 1fr; } .wide { grid-column: auto; } }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDialogComponent {
  readonly data = inject<TransactionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  private readonly service = inject(TransactionsService);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly saving = signal(false); readonly errorMessage = signal(''); readonly controlError = controlError;
  readonly types: { value: TransactionType; label: string }[] = [{ value: 'Income', label: 'Receita' }, { value: 'Expense', label: 'Despesa' }];
  readonly form = this.fb.group({
    description: [this.data.transaction?.description ?? '', [Validators.required, Validators.maxLength(100)]],
    amount: [this.data.transaction?.amount ?? 0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    type: [this.data.transaction?.type ?? 'Expense' as TransactionType, Validators.required],
    transactionDate: [this.data.transaction?.transactionDate ?? localDate(), Validators.required],
    accountId: [this.data.transaction?.accountId ?? this.data.accounts[0]?.id ?? '', Validators.required],
    categoryId: [this.data.transaction?.categoryId ?? this.data.categories[0]?.id ?? '', Validators.required],
  });
  submit(): void { this.form.markAllAsTouched(); if (this.form.invalid || this.saving()) return; this.saving.set(true); this.errorMessage.set(''); const input = this.form.getRawValue() as TransactionInput; const request = this.data.transaction ? this.service.update(this.data.transaction.id, input) : this.service.create(input); request.pipe(finalize(() => this.saving.set(false))).subscribe({ next: (transaction) => this.dialogRef.close(transaction), error: (error: ApiError) => { applyApiFieldErrors(this.form, error); this.errorMessage.set(error.message); } }); }
}

function localDate(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
