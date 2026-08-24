import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiError } from '../../core/errors/api-error';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { AccountDialogComponent } from './account-dialog.component';
import { Account, AccountBalance } from './account.models';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatDialogModule, MatSnackBarModule],
  template: `
    <section class="page">
      <header class="page-header"><div><p class="eyebrow">ORGANIZAÇÃO</p><h1>Contas</h1><p class="page-subtitle">Gerencie onde seu dinheiro está e consulte cada saldo.</p></div><button mat-flat-button (click)="openForm()">+ Nova conta</button></header>
      @if (loading()) { <div class="panel state-card"><div><div class="loading-ring"></div><h2>Carregando contas</h2></div></div> }
      @else if (errorMessage()) { <div class="panel state-card"><div><span class="state-symbol">!</span><h2>Não foi possível carregar as contas</h2><p>{{ errorMessage() }}</p><button mat-stroked-button (click)="load()">Tentar novamente</button></div></div> }
      @else if (accounts().length === 0) { <div class="panel state-card"><div><span class="state-symbol">▣</span><h2>Nenhuma conta cadastrada</h2><p>Crie sua primeira conta para começar a registrar movimentações.</p><button mat-flat-button (click)="openForm()">Criar conta</button></div></div> }
      @else {
        <div class="panel table-wrap"><table class="data-table"><thead><tr><th>Conta</th><th>Saldo inicial</th><th class="hide-mobile">Criada em</th><th class="actions">Ações</th></tr></thead><tbody>
          @for (account of accounts(); track account.id) {
            <tr><td><strong>{{ account.name }}</strong></td><td class="money">{{ account.initialBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td class="hide-mobile">{{ account.createdAt | date:'dd/MM/yyyy' }}</td><td class="actions"><button mat-button (click)="consultBalance(account)">{{ loadingBalanceId() === account.id ? 'Consultando…' : 'Saldo' }}</button><button mat-button (click)="openForm(account)">Editar</button><button mat-button class="danger" (click)="confirmDelete(account)">Excluir</button></td></tr>
            @if (balances()[account.id]; as balance) { <tr class="balance-row"><td colspan="4"><div class="balance-grid"><span>Inicial <strong>{{ balance.initialBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></span><span>Receitas <strong class="income">{{ balance.totalIncome | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></span><span>Despesas <strong class="expense">{{ balance.totalExpense | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></span><span>Saldo atual <strong>{{ balance.currentBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></span></div></td></tr> }
          }
        </tbody></table></div>
      }
    </section>
  `,
  styles: [`
    .danger { color: var(--expense); } .state-symbol { display: inline-grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: var(--surface-soft); color: var(--brand); font-weight: 900; }
    .balance-row td { padding: 0 18px 18px; border-top: 0; } .balance-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; padding: 16px; background: var(--surface-soft); border-radius: 13px; }
    .balance-grid span { color: var(--muted); font-size: .76rem; } .balance-grid strong { display: block; margin-top: 5px; color: var(--ink); font-size: .92rem; } .balance-grid .income { color: var(--income); } .balance-grid .expense { color: var(--expense); }
    @media(max-width:700px) { .balance-grid { grid-template-columns: 1fr 1fr; } .actions button { min-width: auto; padding: 0 8px; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  private readonly service = inject(AccountsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  readonly accounts = signal<Account[]>([]);
  readonly balances = signal<Record<string, AccountBalance>>({});
  readonly loading = signal(true);
  readonly loadingBalanceId = signal('');
  readonly errorMessage = signal('');

  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); this.errorMessage.set(''); this.service.list().subscribe({ next: (items) => { this.accounts.set([...items].sort((a,b) => a.name.localeCompare(b.name))); this.loading.set(false); }, error: (error: ApiError) => { this.errorMessage.set(error.message); this.loading.set(false); } }); }
  openForm(account?: Account): void { this.dialog.open(AccountDialogComponent, { data: { account }, width: '520px' }).afterClosed().subscribe((saved?: Account) => { if (saved) { this.snackBar.open(account ? 'Conta atualizada.' : 'Conta criada.', 'Fechar', { duration: 3000 }); this.load(); } }); }
  consultBalance(account: Account): void { if (this.loadingBalanceId()) return; this.loadingBalanceId.set(account.id); this.service.getBalance(account.id).subscribe({ next: (balance) => { this.balances.update((all) => ({ ...all, [account.id]: balance })); this.loadingBalanceId.set(''); }, error: (error: ApiError) => { this.snackBar.open(error.message, 'Fechar', { duration: 5000 }); this.loadingBalanceId.set(''); } }); }
  confirmDelete(account: Account): void { this.dialog.open(ConfirmDialogComponent, { data: { title: 'Excluir conta?', message: `A conta “${account.name}” será excluída. Esta ação não pode ser desfeita.` } }).afterClosed().subscribe((confirmed) => { if (confirmed) this.delete(account); }); }
  private delete(account: Account): void { this.service.delete(account.id).subscribe({ next: () => { this.snackBar.open('Conta excluída.', 'Fechar', { duration: 3000 }); this.load(); }, error: (error: ApiError) => this.snackBar.open(error.status === 409 ? 'Esta conta possui transações vinculadas e não pode ser excluída.' : error.message, 'Fechar', { duration: 6000 }) }); }
}
