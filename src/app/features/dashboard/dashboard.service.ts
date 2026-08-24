import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/api/api-client.service';
import { Dashboard } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly api: ApiClient) {}
  get() { return this.api.get<Dashboard>('/dashboard'); }
}
