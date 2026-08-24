import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/api/api-client.service';
import { Transaction, TransactionInput } from './transaction.models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  constructor(private readonly api: ApiClient) {}
  list() { return this.api.get<Transaction[]>('/transactions'); }
  create(input: TransactionInput) { return this.api.post<Transaction>('/transactions', input); }
  update(id: string, input: TransactionInput) { return this.api.put<Transaction>(`/transactions/${id}`, input); }
  delete(id: string) { return this.api.delete<Transaction>(`/transactions/${id}`); }
}
