import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiError } from '../../core/errors/api-error';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { CategoriesService } from './categories.service';
import { CategoryDialogComponent } from './category-dialog.component';
import { Category } from './category.models';

@Component({
  selector: 'app-categories',
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatSnackBarModule],
  template: `
    <section class="page"><header class="page-header"><div><p class="eyebrow">CLASSIFICAÇÃO</p><h1>Categorias</h1><p class="page-subtitle">Organize as movimentações para entender melhor seus gastos.</p></div><button mat-flat-button (click)="openForm()">+ Nova categoria</button></header>
      @if (loading()) { <div class="panel state-card"><div><div class="loading-ring"></div><h2>Carregando categorias</h2></div></div> }
      @else if (errorMessage()) { <div class="panel state-card"><div><span class="state-symbol">!</span><h2>Não foi possível carregar as categorias</h2><p>{{ errorMessage() }}</p><button mat-stroked-button (click)="load()">Tentar novamente</button></div></div> }
      @else if (categories().length === 0) { <div class="panel state-card"><div><span class="state-symbol">◇</span><h2>Nenhuma categoria cadastrada</h2><p>Crie categorias como Moradia, Alimentação ou Salário para classificar suas transações.</p><button mat-flat-button (click)="openForm()">Criar categoria</button></div></div> }
      @else { <div class="panel category-grid">@for (category of categories(); track category.id) { <article><span class="category-mark">{{ category.name.charAt(0).toUpperCase() }}</span><div><strong>{{ category.name }}</strong><small>Criada em {{ category.createdAt | date:'dd/MM/yyyy' }}</small></div><div class="actions"><button mat-button (click)="openForm(category)">Editar</button><button mat-button class="danger" (click)="confirmDelete(category)">Excluir</button></div></article> }</div> }
    </section>
  `,
  styles: [`
    .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; } article { display: flex; min-width: 0; align-items: center; gap: 14px; padding: 20px; border-bottom: 1px solid var(--line); } article:nth-child(odd) { border-right: 1px solid var(--line); } .category-mark, .state-symbol { display: grid; width: 42px; height: 42px; flex: 0 0 auto; place-items: center; border-radius: 12px; background: #e8f2ed; color: var(--brand); font-weight: 850; } article > div:not(.actions) { min-width: 0; } article strong, article small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } article small { margin-top: 5px; color: var(--muted); font-size: .75rem; } .actions { display: flex; margin-left: auto; } .danger { color: var(--expense); }
    @media(max-width:780px) { .category-grid { grid-template-columns: 1fr; } article:nth-child(odd) { border-right: 0; } } @media(max-width:480px) { article { align-items: flex-start; flex-wrap: wrap; } .actions { width: 100%; margin-left: 52px; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private readonly service = inject(CategoriesService); private readonly dialog = inject(MatDialog); private readonly snackBar = inject(MatSnackBar);
  readonly categories = signal<Category[]>([]); readonly loading = signal(true); readonly errorMessage = signal('');
  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); this.errorMessage.set(''); this.service.list().subscribe({ next: (items) => { this.categories.set([...items].sort((a,b) => a.name.localeCompare(b.name))); this.loading.set(false); }, error: (error: ApiError) => { this.errorMessage.set(error.message); this.loading.set(false); } }); }
  openForm(category?: Category): void { this.dialog.open(CategoryDialogComponent, { data: { category }, width: '520px' }).afterClosed().subscribe((saved?: Category) => { if (saved) { this.snackBar.open(category ? 'Categoria atualizada.' : 'Categoria criada.', 'Fechar', { duration: 3000 }); this.load(); } }); }
  confirmDelete(category: Category): void { this.dialog.open(ConfirmDialogComponent, { data: { title: 'Excluir categoria?', message: `A categoria “${category.name}” será excluída. Esta ação não pode ser desfeita.` } }).afterClosed().subscribe((confirmed) => { if (confirmed) this.delete(category); }); }
  private delete(category: Category): void { this.service.delete(category.id).subscribe({ next: () => { this.snackBar.open('Categoria excluída.', 'Fechar', { duration: 3000 }); this.load(); }, error: (error: ApiError) => this.snackBar.open(error.status === 409 ? 'Esta categoria possui transações vinculadas e não pode ser excluída.' : error.message, 'Fechar', { duration: 6000 }) }); }
}
