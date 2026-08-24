export interface Dashboard {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  spendingByCategory: CategorySpending[];
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  total: number;
}
