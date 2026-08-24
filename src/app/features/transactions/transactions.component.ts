import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ApiError } from '../../core/errors/api-error';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { Account } from '../accounts/account.models';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.models';
import { TransactionDialogComponent } from './transaction-dialog.component';
import { Transaction } from './transaction.models';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, MatButtonModule, MatDialogModule, MatSnackBarModule],
  template: `
    <section class="page"><header class="page-header"><div><p class="eyebrow">MOVIMENTAÇÕES</p><h1>Transações</h1><p class="page-subtitle">Acompanhe receitas e despesas vinculadas às suas contas.</p></div><button mat-flat-button (click)="openForm()" [disabled]="!canCreate()" [title]="canCreate() ? '' : 'Cadastre uma conta e uma categoria primeiro'">+ Nova transação</button></header>
      @if (loading()) { <div class="panel state-card"><div><div class="loading-ring"></div><h2>Carregando transações</h2></div></div> }
      @else if (errorMessage()) { <div class="panel state-card"><div><span class="state-symbol">!</span><h2>Não foi possível carregar as transações</h2><p>{{ errorMessage() }}</p><button mat-stroked-button (click)="load()">Tentar novamente</button></div></div> }
      @else if (transactions().length === 0) { <div class="panel state-card"><div><span class="state-symbol">⇄</span><h2>Nenhuma transação registrada</h2><p>{{ canCreate() ? 'Registre uma receita ou despesa para começar a acompanhar sua movimentação.' : 'Cadastre ao menos uma conta e uma categoria antes de criar sua primeira transação.' }}</p>@if (canCreate()) { <button mat-flat-button (click)="openForm()">Criar transação</button> }</div></div> }
      @else { <div class="panel table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th><th class="hide-mobile">Conta</th><th class="hide-mobile">Categoria</th><th class="actions">Ações</th></tr></thead><tbody>@for (transaction of transactions(); track transaction.id) { <tr><td>{{ formatDate(transaction.transactionDate) }}</td><td><strong>{{ transaction.description }}</strong><small class="mobile-relations">{{ accountName(transaction.accountId) }} · {{ categoryName(transaction.categoryId) }}</small></td><td><span class="type-chip" [class.income-chip]="transaction.type === 'Income'">{{ transaction.type === 'Income' ? 'Receita' : 'Despesa' }}</span></td><td class="money" [class.income]="transaction.type === 'Income'" [class.expense]="transaction.type === 'Expense'">{{ transaction.type === 'Expense' ? '−' : '+' }} {{ transaction.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td class="hide-mobile">{{ accountName(transaction.accountId) }}</td><td class="hide-mobile">{{ categoryName(transaction.categoryId) }}</td><td class="actions"><button mat-button (click)="openForm(transaction)">Editar</button><button mat-button class="danger" (click)="confirmDelete(transaction)">Excluir</button></td></tr> }</tbody></table></div> }
    </section>
  `,
  styles: [`
    .type-chip { display: inline-block; padding: 5px 9px; border-radius: 999px; background: #fdeaea; color: var(--expense); font-size: .74rem; font-weight: 800; } .income-chip { background: #e5f5ec; color: var(--income); } .danger { color: var(--expense); } .state-symbol { display: inline-grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: var(--surface-soft); color: var(--brand); font-weight: 900; } .mobile-relations { display: none; margin-top: 5px; color: var(--muted); font-size: .72rem; font-weight: 400; } @media(max-width:700px) { .mobile-relations { display: block; } .actions button { min-width: auto; padding: 0 7px; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
  private readonly service = inject(TransactionsService); private readonly accountsService = inject(AccountsService); private readonly categoriesService = inject(CategoriesService); private readonly dialog = inject(MatDialog); private readonly snackBar = inject(MatSnackBar);
  readonly transactions = signal<Transaction[]>([]); readonly accounts = signal<Account[]>([]); readonly categories = signal<Category[]>([]); readonly loading = signal(true); readonly errorMessage = signal('');
  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); this.errorMessage.set(''); forkJoin({ transactions: this.service.list(), accounts: this.accountsService.list(), categories: this.categoriesService.list() }).subscribe({ next: ({ transactions, accounts, categories }) => { this.transactions.set([...transactions].sort((a,b) => b.transactionDate.localeCompare(a.transactionDate) || b.createdAt.localeCompare(a.createdAt))); this.accounts.set(accounts); this.categories.set(categories); this.loading.set(false); }, error: (error: ApiError) => { this.errorMessage.set(error.message); this.loading.set(false); } }); }
  canCreate(): boolean { return this.accounts().length > 0 && this.categories().length > 0; }
  accountName(id: string): string { return this.accounts().find((item) => item.id === id)?.name ?? 'Conta indisponível'; }
  categoryName(id: string): string { return this.categories().find((item) => item.id === id)?.name ?? 'Categoria indisponível'; }
  formatDate(value: string): string { const [year, month, day] = value.split('-'); return year && month && day ? `${day}/${month}/${year}` : value; }
  openForm(transaction?: Transaction): void { if (!this.canCreate()) return; this.dialog.open(TransactionDialogComponent, { data: { transaction, accounts: this.accounts(), categories: this.categories() }, width: '680px' }).afterClosed().subscribe((saved?: Transaction) => { if (saved) { this.snackBar.open(transaction ? 'Transação atualizada.' : 'Transação criada.', 'Fechar', { duration: 3000 }); this.load(); } }); }
  confirmDelete(transaction: Transaction): void { this.dialog.open(ConfirmDialogComponent, { data: { title: 'Excluir transação?', message: `A transação “${transaction.description}” será excluída. Esta ação não pode ser desfeita.` } }).afterClosed().subscribe((confirmed) => { if (confirmed) this.delete(transaction); }); }
  private delete(transaction: Transaction): void { this.service.delete(transaction.id).subscribe({ next: () => { this.snackBar.open('Transação excluída.', 'Fechar', { duration: 3000 }); this.load(); }, error: (error: ApiError) => this.snackBar.open(error.message, 'Fechar', { duration: 5000 }) }); }
}
