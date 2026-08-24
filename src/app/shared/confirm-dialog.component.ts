import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">{{ data.confirmLabel ?? 'Excluir' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`mat-dialog-content p { color: var(--muted); line-height: 1.55; max-width: 440px; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
