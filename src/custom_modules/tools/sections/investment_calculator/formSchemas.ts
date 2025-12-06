// schemas/investmentSchemas.ts
import { z } from 'zod';

// Helper to transform empty strings to 0
const numberOrEmpty = z.union([z.number(), z.string()]).transform((val) => {
  if (val === '' || val === null || val === undefined) return 0;
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return isNaN(num) ? 0 : num;
});

// Property Information Schema
export const propertyFormSchema = z.object({
  propertyValue: numberOrEmpty.pipe(z.number().min(1, 'Property value must be greater than 0')),
  downPayment: numberOrEmpty.pipe(z.number().min(0, 'Down payment cannot be negative')),
  closingCosts: numberOrEmpty.pipe(z.number().min(0, 'Closing costs cannot be negative')),
  renovationCosts: numberOrEmpty.pipe(z.number().min(0, 'Renovation costs cannot be negative')),
  numberOfUnits: numberOrEmpty.pipe(
    z.number().int().min(1, 'Must have at least 1 unit').max(100, 'Maximum 100 units')
  ),
  otherIncome: numberOrEmpty.pipe(z.number().min(0, 'Other income cannot be negative')),
});

// Unit Schema
export const unitSchema = z.object({
  id: z.number(),
  currentRent: numberOrEmpty.pipe(z.number().min(0, 'Current rent cannot be negative')),
  repairCosts: numberOrEmpty.pipe(z.number().min(0, 'Repair costs cannot be negative')),
  potentialRent: numberOrEmpty.pipe(z.number().min(0, 'Potential rent cannot be negative')),
  marketValue: numberOrEmpty.pipe(z.number().min(0, 'Market value cannot be negative')),
  bedrooms: numberOrEmpty.pipe(
    z.number().int().min(0, 'Bedrooms cannot be negative').max(10, 'Maximum 10 bedrooms')
  ),
  bathrooms: numberOrEmpty.pipe(
    z.number().min(0, 'Bathrooms cannot be negative').max(10, 'Maximum 10 bathrooms')
  ),
});

// Renovation Item Schema
export const renovationItemSchema = z.object({
  id: z.number(),
  category: z.string().min(1, 'Category is required'),
  cost: numberOrEmpty.pipe(z.number().min(0, 'Cost cannot be negative')),
});

// Expenses Schema
export const expensesFormSchema = z.object({
  // Current Expenses
  currentInsurance: numberOrEmpty.pipe(z.number().min(0, 'Insurance cannot be negative')),
  currentPropertyTaxes: numberOrEmpty.pipe(z.number().min(0, 'Property taxes cannot be negative')),
  currentMaintenance: numberOrEmpty.pipe(z.number().min(0, 'Maintenance cannot be negative')),
  currentManagementPercent: numberOrEmpty.pipe(
    z
      .number()
      .min(0, 'Management percent cannot be negative')
      .max(50, 'Management percent seems too high')
  ),
  currentVacancy: numberOrEmpty.pipe(
    z.number().min(0, 'Vacancy rate cannot be negative').max(100, 'Vacancy rate cannot exceed 100%')
  ),
  currentOtherExpenses: numberOrEmpty.pipe(z.number().min(0, 'Other expenses cannot be negative')),

  // Projected Expenses
  projectedInsurance: numberOrEmpty.pipe(z.number().min(0, 'Insurance cannot be negative')),
  projectedPropertyTaxes: numberOrEmpty.pipe(
    z.number().min(0, 'Property taxes cannot be negative')
  ),
  projectedMaintenance: numberOrEmpty.pipe(z.number().min(0, 'Maintenance cannot be negative')),
  projectedManagementPercent: numberOrEmpty.pipe(
    z
      .number()
      .min(0, 'Management percent cannot be negative')
      .max(50, 'Management percent seems too high')
  ),
  projectedVacancy: numberOrEmpty.pipe(
    z.number().min(0, 'Vacancy rate cannot be negative').max(100, 'Vacancy rate cannot exceed 100%')
  ),
  projectedOtherExpenses: numberOrEmpty.pipe(
    z.number().min(0, 'Other expenses cannot be negative')
  ),
});

// Financing Schema
export const financingFormSchema = z.object({
  loanAmount: numberOrEmpty.pipe(z.number().min(0, 'Loan amount cannot be negative')),
  interestRate: numberOrEmpty,
  loanTerm: numberOrEmpty.pipe(
    z
      .number()
      .int()
      .min(1, 'Loan term must be at least 1 year')
      .max(50, 'Loan term cannot exceed 50 years')
  ),
});

// Target Analysis Schema
export const targetAnalysisSchema = z.object({
  targetCapRate: numberOrEmpty.pipe(
    z.number().min(0, 'Cap rate cannot be negative').max(50, 'Cap rate seems too high')
  ),
  targetCashOnCash: numberOrEmpty.pipe(
    z
      .number()
      .min(0, 'Cash on cash return cannot be negative')
      .max(100, 'Cash on cash return seems too high')
  ),
});

// Combined form schema for complete investment analysis
export const completeInvestmentSchema = z.object({
  property: propertyFormSchema,
  expenses: expensesFormSchema,
  financing: financingFormSchema,
  units: z.array(unitSchema),
  renovationItems: z.array(renovationItemSchema),
  targetAnalysis: targetAnalysisSchema.optional(),
});

// Default values - now using empty strings for optional fields
export const defaultPropertyValues = {
  propertyValue: '',
  downPayment: '',
  closingCosts: '',
  renovationCosts: '',
  numberOfUnits: 1,
  otherIncome: '',
};

export const defaultExpensesValues = {
  // Current Expenses
  currentInsurance: '',
  currentPropertyTaxes: '',
  currentMaintenance: '',
  currentManagementPercent: '',
  currentVacancy: '',
  currentOtherExpenses: '',

  // Projected Expenses
  projectedInsurance: '',
  projectedPropertyTaxes: '',
  projectedMaintenance: '',
  projectedManagementPercent: '',
  projectedVacancy: '',
  projectedOtherExpenses: '',
};

export const defaultFinancingValues = {
  loanAmount: '',
  interestRate: '',
  loanTerm: '',
};

export const defaultUnitValues = {
  id: 1,
  currentRent: '',
  repairCosts: '',
  potentialRent: '',
  marketValue: '',
  bedrooms: '',
  bathrooms: '',
};

export const defaultTargetAnalysisValues = {
  targetCapRate: '',
  targetCashOnCash: '',
};

// Type inference from schemas
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type ExpensesFormData = z.infer<typeof expensesFormSchema>;
export type FinancingFormData = z.infer<typeof financingFormSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type RenovationItemFormData = z.infer<typeof renovationItemSchema>;
export type TargetAnalysisFormData = z.infer<typeof targetAnalysisSchema>;
export type CompleteInvestmentFormData = z.infer<typeof completeInvestmentSchema>;
