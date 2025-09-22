// types/investment.ts

export interface UnitData {
  id: number;
  currentRent: number;
  repairCosts: number;
  potentialRent: number;
  marketValue: number;
  bedrooms: number;
  bathrooms: number;
}

export interface RenovationItem {
  id: number;
  category: string;
  cost: number;
}

export interface PropertyFormData {
  propertyValue: number;
  downPayment: number;
  closingCosts: number;
  renovationCosts: number;
  numberOfUnits: number;
  otherIncome: number;
}

export interface ExpenseFormData {
  // Current Expenses
  currentInsurance: number;
  currentPropertyTaxes: number;
  currentMaintenance: number;
  currentManagementPercent: number;
  currentVacancy: number;
  currentOtherExpenses: number;

  // Projected Expenses
  projectedInsurance: number;
  projectedPropertyTaxes: number;
  projectedMaintenance: number;
  projectedManagementPercent: number;
  projectedVacancy: number;
  projectedOtherExpenses: number;
}

export interface FinancingFormData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export interface InvestmentFormData extends PropertyFormData, ExpenseFormData, FinancingFormData {
  units: UnitData[];
  renovationItems: RenovationItem[];
}

export interface ProjectionData {
  rent: number;
  propertyValue: number;
  cashFlow: number;
  equity: number;
  capRate: number;
  roi: number;
}

export interface CalculationResults {
  totalIncome: number;
  totalExpenses: number;
  netOperatingIncome: number;
  capRate: number;
  cashOnCashReturn: number;
  totalCashInvested: number;
  annualCashFlow: number;
  monthlyUnits: number;
  currentCapRate: number;
  improvedCapRate: number;
  totalRepairCosts: number;
  totalIncomeIncrease: number;
  valueGain: number;
  debtServiceCoverageRatio: number;
  projections: {
    year3: ProjectionData;
    year5: ProjectionData;
  };
}

export interface TargetAnalysisData {
  targetCapRate: number;
  targetCashOnCash: number;
}

export interface TargetResults {
  recommendedPurchasePrice: number;
  maxOfferPrice: number;
  capRateBasedPrice: number;
  cashOnCashBasedPrice: number;
}

export const RENOVATION_CATEGORIES = [
  'Landscaping',
  'Roof',
  'Painting/Pressure Washing',
  'Doors and Windows',
  'Lighting and Security',
  'Kitchen',
  'Bathroom',
  'Flooring',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Other',
] as const;

export type RenovationCategory = (typeof RENOVATION_CATEGORIES)[number];

// Default form values
export const DEFAULT_PROPERTY_VALUES: PropertyFormData = {
  propertyValue: 500000,
  downPayment: 100000,
  closingCosts: 15000,
  renovationCosts: 0,
  numberOfUnits: 1,
  otherIncome: 0,
};

export const DEFAULT_EXPENSE_VALUES: ExpenseFormData = {
  currentInsurance: 200,
  currentPropertyTaxes: 400,
  currentMaintenance: 300,
  currentManagementPercent: 8,
  currentVacancy: 5,
  currentOtherExpenses: 100,
  projectedInsurance: 250,
  projectedPropertyTaxes: 500,
  projectedMaintenance: 400,
  projectedManagementPercent: 8,
  projectedVacancy: 3,
  projectedOtherExpenses: 150,
};

export const DEFAULT_FINANCING_VALUES: FinancingFormData = {
  loanAmount: 400000,
  interestRate: 7.5,
  loanTerm: 30,
};

export const DEFAULT_UNIT: Omit<UnitData, 'id'> = {
  currentRent: 0,
  repairCosts: 0,
  potentialRent: 0,
  marketValue: 0,
  bedrooms: 0,
  bathrooms: 0,
};
