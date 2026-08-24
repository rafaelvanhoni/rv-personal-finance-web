import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ApiError } from '../../core/errors/api-error';
import { Dashboard } from './dashboard.models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, MatButtonModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div><p class="eyebrow">VISÃO GERAL</p><h1>Dashboard</h1><p class="page-subtitle">Um retrato de todo o seu histórico financeiro.</p></div>
      </header>
      @if (loading()) {
        <div class="panel state-card" aria-live="polite"><div><div class="loading-ring"></div><h2>Calculando seus indicadores</h2></div></div>
      } @else if (errorMessage()) {
        <div class="panel state-card"><div><span class="state-symbol">!</span><h2>Não foi possível carregar o dashboard</h2><p>{{ errorMessage() }}</p><button mat-stroked-button (click)="load()">Tentar novamente</button></div></div>
      } @else if (dashboard(); as data) {
        <div class="metrics">
          <article class="metric balance"><span>Saldo atual</span><strong>{{ data.currentBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong><small>Saldo inicial + receitas − despesas</small></article>
          <article class="metric"><span>Receitas</span><strong class="income">{{ data.totalIncome | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong><small>Total acumulado</small></article>
          <article class="metric"><span>Despesas</span><strong class="expense">{{ data.totalExpense | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong><small>Total acumulado</small></article>
        </div>
        <section class="panel spending">
          <div class="section-heading"><div><h2>Gastos por categoria</h2><p>Distribuição das despesas em todo o histórico.</p></div><span>{{ data.spendingByCategory.length }} categorias</span></div>
          @if (data.spendingByCategory.length === 0) {
            <div class="empty-spending"><span>◇</span><p>Quando você registrar despesas, a distribuição aparecerá aqui.</p></div>
          } @else {
            <div class="spending-list">
              @for (item of data.spendingByCategory; track item.categoryId) {
                <div class="spending-item">
                  <div class="spending-label"><strong>{{ item.categoryName }}</strong><span>{{ item.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
                  <div class="bar"><span [style.width.%]="barWidth(item.total, data)"></span></div>
                </div>
              }
            </div>
          }
        </section>
      }
    </section>
  `,
  styles: [`
    .metrics { display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 16px; margin-bottom: 18px; }
    .metric { display: flex; min-height: 156px; padding: 24px; flex-direction: column; background: var(--surface); border: 1px solid var(--line); border-radius: 18px; box-shadow: var(--shadow); }
    .metric.balance { background: linear-gradient(135deg, var(--brand-dark), #245c49); border: 0; color: #fff; }
    .metric > span { color: var(--muted); font-size: .84rem; font-weight: 700; }
    .metric.balance > span, .metric.balance small { color: #b8cbc4; }
    .metric strong { margin: 15px 0 8px; font-size: clamp(1.55rem, 3vw, 2.2rem); letter-spacing: -.04em; }
    .metric small { margin-top: auto; color: var(--muted); }
    .spending { padding: 26px; }
    .section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
    .section-heading h2 { margin: 0 0 6px; font-size: 1.22rem; }
    .section-heading p { margin: 0; color: var(--muted); }
    .section-heading > span { padding: 6px 10px; border-radius: 999px; background: var(--surface-soft); color: var(--muted); font-size: .76rem; font-weight: 700; }
    .spending-list { display: grid; gap: 22px; }
    .spending-label { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 9px; font-size: .9rem; }
    .spending-label span { color: var(--muted); font-variant-numeric: tabular-nums; }
    .bar { height: 10px; overflow: hidden; background: #e8eee9; border-radius: 999px; }
    .bar span { display: block; min-width: 4px; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--brand), #75a43d); }
    .empty-spending { display: grid; min-height: 170px; place-items: center; align-content: center; color: var(--muted); text-align: center; }
    .empty-spending span, .state-symbol { display: inline-grid; width: 42px; height: 42px; place-items: center; margin: auto; border-radius: 50%; background: var(--surface-soft); color: var(--brand); font-size: 1.2rem; font-weight: 800; }
    @media (max-width: 860px) { .metrics { grid-template-columns: 1fr 1fr; } .metric.balance { grid-column: 1 / -1; } }
    @media (max-width: 560px) { .metrics { grid-template-columns: 1fr; } .metric.balance { grid-column: auto; } .section-heading { flex-direction: column; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);
  readonly dashboard = signal<Dashboard | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading.set(true); this.errorMessage.set('');
    this.service.get().subscribe({
      next: (data) => { this.dashboard.set(data); this.loading.set(false); },
      error: (error: ApiError) => { this.errorMessage.set(error.message); this.loading.set(false); },
    });
  }
  barWidth(total: number, data: Dashboard): number {
    const maximum = Math.max(...data.spendingByCategory.map((item) => item.total), 0);
    return maximum > 0 ? (total / maximum) * 100 : 0;
  }
}
