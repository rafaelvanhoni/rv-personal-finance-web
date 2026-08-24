import { HttpErrorResponse } from '@angular/common/http';
import { ApiOperationError, ApiResult, ProblemDetails } from '../api/api.models';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status = 0,
    readonly fieldErrors: Readonly<Record<string, string[]>> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError('Não foi possível concluir a operação. Tente novamente.');
  }

  const body = error.error as ApiResult<unknown> | ProblemDetails | string | null;
  if (isApiResult(body)) {
    return new ApiError(
      friendlyStatusMessage(error.status, body.status),
      error.status,
      groupFieldErrors(body.errors ?? []),
    );
  }
  return new ApiError(problemMessage(error.status), error.status);
}

function groupFieldErrors(errors: ApiOperationError[]): Record<string, string[]> {
  return errors.reduce<Record<string, string[]>>((result, item) => {
    if (!item.property) return result;
    const key = item.property.charAt(0).toLowerCase() + item.property.slice(1);
    (result[key] ??= []).push(translateValidation(item.message));
    return result;
  }, {});
}

function translateValidation(message: string): string {
  if (/required/i.test(message)) return 'Campo obrigatório.';
  if (/must not exceed/i.test(message)) return 'O limite de caracteres foi excedido.';
  if (/greater than zero/i.test(message)) return 'Informe um valor maior que zero.';
  if (/zero or greater/i.test(message)) return 'Informe um valor igual ou maior que zero.';
  if (/decimal places/i.test(message)) return 'Use no máximo duas casas decimais.';
  if (/not found/i.test(message)) return 'A opção selecionada não está mais disponível.';
  if (/invalid transaction type/i.test(message)) return 'Selecione um tipo válido.';
  return 'Valor inválido.';
}

function friendlyStatusMessage(status: number, apiStatus?: string): string {
  if (status === 401 || apiStatus === 'Unauthorized') return 'E-mail ou senha inválidos.';
  if (status === 404 || apiStatus === 'NotFound') return 'O registro solicitado não foi encontrado.';
  if (status === 409 || apiStatus === 'Conflict') return 'Não foi possível concluir porque o registro já existe ou está em uso.';
  if (status === 422 || apiStatus === 'BusinessError') return 'A operação não pôde ser concluída pelas regras do sistema.';
  if (status === 400 || apiStatus === 'ValidationError') return 'Revise os campos informados.';
  return problemMessage(status);
}

function problemMessage(status: number): string {
  if (status === 0) return 'Não foi possível conectar à API. Verifique se ela está em execução.';
  if (status >= 500) return 'A API encontrou um problema inesperado. Tente novamente em instantes.';
  return 'Não foi possível concluir a operação. Tente novamente.';
}

function isApiResult(value: unknown): value is ApiResult<unknown> {
  return typeof value === 'object' && value !== null && ('errors' in value || 'isSuccess' in value);
}
