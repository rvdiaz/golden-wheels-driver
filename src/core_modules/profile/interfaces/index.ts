export interface IIncome {
  id: string;
  userId: string;
  source: string;
  amount: number;
  description?: string;
  propertyAddress?: string;
  status: string;
  createdAt: string;
  expectedDate: string;
  completed: boolean;
}
