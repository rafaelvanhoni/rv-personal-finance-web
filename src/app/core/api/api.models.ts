export type ApiStatus =
  | 'Success'
  | 'NotFound'
  | 'ValidationError'
  | 'BusinessError'
  | 'Created'
  | 'Conflict'
  | 'Unauthorized';

export interface ApiOperationError {
  property?: string | null;
  message: string;
}

export interface ApiResult<T> {
  status: ApiStatus;
  isSuccess: boolean;
  errors: ApiOperationError[];
  data?: T | null;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}
