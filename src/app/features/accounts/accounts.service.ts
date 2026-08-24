import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/api/api-client.service';
import { Account, AccountBalance, AccountInput } from './account.models';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  constructor(private readonly api: ApiClient) {}
  list() { return this.api.get<Account[]>('/accounts'); }
  create(input: AccountInput) { return this.api.post<Account>('/accounts', input); }
  update(id: string, input: AccountInput) { return this.api.put<Account>(`/accounts/${id}`, input); }
  delete(id: string) { return this.api.delete<Account>(`/accounts/${id}`); }
  getBalance(id: string) { return this.api.get<AccountBalance>(`/accounts/${id}/balance`); }
}
