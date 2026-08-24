import { FormGroup } from '@angular/forms';
import { ApiError } from './api-error';

export function applyApiFieldErrors(form: FormGroup, error: ApiError): void {
  Object.entries(error.fieldErrors).forEach(([field, messages]) => {
    const control = form.get(field);
    if (control) control.setErrors({ ...control.errors, api: messages[0] });
  });
}

export function controlError(form: FormGroup, field: string): string {
  const control = form.get(field);
  if (!control || !control.touched || !control.errors) return '';
  if (control.errors['api']) return control.errors['api'];
  if (control.errors['required']) return 'Campo obrigatório.';
  if (control.errors['email']) return 'Informe um e-mail válido.';
  if (control.errors['maxlength']) return `Use no máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
  if (control.errors['min']) return 'Informe um valor válido.';
  if (control.errors['pattern']) return 'Use no máximo duas casas decimais.';
  return 'Valor inválido.';
}
