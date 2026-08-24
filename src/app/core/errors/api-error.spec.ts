import { HttpErrorResponse } from '@angular/common/http';
import { toApiError } from './api-error';

describe('toApiError', () => {
  it('maps PascalCase validation properties to camelCase form fields', () => {
    const result = toApiError(new HttpErrorResponse({
      status: 400,
      error: {
        status: 'ValidationError',
        isSuccess: false,
        data: null,
        errors: [{ property: 'AccountId', message: 'AccountId is required.' }],
      },
    }));

    expect(result.message).toBe('Revise os campos informados.');
    expect(result.fieldErrors['accountId']).toEqual(['Campo obrigatório.']);
  });

  it('provides a useful message for network failures', () => {
    const result = toApiError(new HttpErrorResponse({ status: 0 }));
    expect(result.message).toContain('conectar à API');
  });
});
