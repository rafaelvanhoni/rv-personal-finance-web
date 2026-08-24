import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/errors/api-error';
import { applyApiFieldErrors, controlError } from '../../core/errors/form-error';
import { CategoriesService } from './categories.service';
import { Category } from './category.models';

export interface CategoryDialogData { category?: Category; }

@Component({
  selector: 'app-category-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.category ? 'Editar categoria' : 'Nova categoria' }}</h2>
    <mat-dialog-content><form id="category-form" class="dialog-form" [formGroup]="form" (ngSubmit)="submit()"><mat-form-field appearance="outline"><mat-label>Nome</mat-label><input matInput formControlName="name" maxlength="50" autocomplete="off">@if (controlError(form, 'name')) { <mat-error>{{ controlError(form, 'name') }}</mat-error> }</mat-form-field>@if (errorMessage()) { <p class="dialog-error" role="alert">{{ errorMessage() }}</p> }</form></mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions"><button mat-button mat-dialog-close [disabled]="saving()">Cancelar</button><button mat-flat-button type="submit" form="category-form" [disabled]="saving()">{{ saving() ? 'Salvando…' : 'Salvar' }}</button></mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialogComponent {
  readonly data = inject<CategoryDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  private readonly service = inject(CategoriesService);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly controlError = controlError;
  readonly form = this.fb.group({ name: [this.data.category?.name ?? '', [Validators.required, Validators.maxLength(50)]] });
  submit(): void { this.form.markAllAsTouched(); if (this.form.invalid || this.saving()) return; this.saving.set(true); this.errorMessage.set(''); const request = this.data.category ? this.service.update(this.data.category.id, this.form.getRawValue()) : this.service.create(this.form.getRawValue()); request.pipe(finalize(() => this.saving.set(false))).subscribe({ next: (category) => this.dialogRef.close(category), error: (error: ApiError) => { applyApiFieldErrors(this.form, error); this.errorMessage.set(error.message); } }); }
}
