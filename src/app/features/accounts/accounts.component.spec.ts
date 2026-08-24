import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { AccountsComponent } from './accounts.component';
import { AccountsService } from './accounts.service';

describe('AccountsComponent', () => {
  const service = { list: vi.fn() };

  beforeEach(async () => {
    service.list.mockReset();
    service.list.mockReturnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [AccountsComponent],
      providers: [
        { provide: AccountsService, useValue: service },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
    }).compileComponents();
  });

  it('clears previously consulted balances whenever accounts are reloaded', () => {
    const component = TestBed.createComponent(AccountsComponent).componentInstance;
    component.balances.set({
      'account-id': {
        initialBalance: 100,
        totalIncome: 50,
        totalExpense: 20,
        currentBalance: 130,
      },
    });

    component.load();

    expect(component.balances()).toEqual({});
    expect(service.list).toHaveBeenCalledOnce();
  });
});
