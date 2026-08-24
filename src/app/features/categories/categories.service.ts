import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/api/api-client.service';
import { Category, CategoryInput } from './category.models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private readonly api: ApiClient) {}
  list() { return this.api.get<Category[]>('/categories'); }
  create(input: CategoryInput) { return this.api.post<Category>('/categories', input); }
  update(id: string, input: CategoryInput) { return this.api.put<Category>(`/categories/${id}`, input); }
  delete(id: string) { return this.api.delete<Category>(`/categories/${id}`); }
}
