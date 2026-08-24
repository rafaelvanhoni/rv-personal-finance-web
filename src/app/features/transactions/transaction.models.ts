export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
  createdAt: string;
}

export interface TransactionInput {
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
}
