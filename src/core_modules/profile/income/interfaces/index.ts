export enum IncomeStatus {
  pending = 'pending',
  completed = 'completed',
}

export enum IncomeSource {
  Salary = 'salary',
  Rental = 'rental',
  Freelance = 'freelance',
  Business = 'business',
  Investment = 'investment',
  Commission = 'commission',
  Bonus = 'bonus',
  Pension = 'pension',
  Other = 'other',
}

export interface IIncome {
  id: string;
  userId: string;
  source: IncomeSource;
  amount: number;
  description?: string;
  propertyAddress?: string;
  status: IncomeStatus;
  createdAt: string;
  updatedAt: string;
  expectedDate: string;
}

export interface IFormData {
  sourceDropDown: string;
  source: IncomeSource | string;
  amount: number;
  description?: string;
  propertyAddress?: string;
  status: IncomeStatus;
  expectedDate: Date | string;
}
