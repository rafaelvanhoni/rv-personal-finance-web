export interface Account {
  id: string;
  userId: string;
  name: string;
  initialBalance: number;
  createdAt: string;
}

export interface AccountInput {
  name: string;
  initialBalance: number;
}

export interface AccountBalance {
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
}
