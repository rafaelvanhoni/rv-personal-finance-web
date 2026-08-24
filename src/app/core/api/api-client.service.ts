import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiError, toApiError } from '../errors/api-error';
import { ApiResult } from './api.models';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<ApiResult<T>>(`${this.baseUrl}${path}`).pipe(this.unwrap());
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiResult<T>>(`${this.baseUrl}${path}`, body).pipe(this.unwrap());
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiResult<T>>(`${this.baseUrl}${path}`, body).pipe(this.unwrap());
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResult<T>>(`${this.baseUrl}${path}`).pipe(this.unwrap());
  }

  private unwrap<T>() {
    return (source: Observable<ApiResult<T>>): Observable<T> =>
      source.pipe(
        map((result) => {
          if (!result.isSuccess || result.data === null || result.data === undefined) {
            throw new ApiError('A API retornou uma resposta sem os dados esperados.');
          }
          return result.data;
        }),
        catchError((error: unknown) => throwError(() => toApiError(error))),
      );
  }
}
