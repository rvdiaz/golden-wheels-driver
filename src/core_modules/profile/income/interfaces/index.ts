export enum IncomeStatus {
  pending = 'pending',
  completed = 'completed',
}

export enum IncomeSource {
  Sale = 'sale',
  Rental = 'rental',
}

export interface IIncome {
  id: string;
  userId: string;
  source: IncomeSource;
  amount: number;
  description?: string;
  customerName: string;
  propertyAddress?: string;
  status: IncomeStatus;
  createdAt: string;
  updatedAt: string;
  expectedDate: string;
}

export interface IFormData {
  sourceDropDown: string;
  amount: number;
  customerName: string;
  description?: string;
  propertyAddress?: string;
  status: IncomeStatus;
  expectedDate: Date | string;
}
