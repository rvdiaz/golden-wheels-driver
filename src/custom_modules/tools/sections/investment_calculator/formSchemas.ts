// schemas/investmentSchemas.ts
import { z } from 'zod';

// Property Information Schema
export const propertyFormSchema = z.object({
  propertyValue: z.number().min(1, 'Property value must be greater than 0'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  closingCosts: z.number().min(0, 'Closing costs cannot be negative'),
  renovationCosts: z.number().min(0, 'Renovation costs cannot be negative'),
  numberOfUnits: z.number().int().min(1, 'Must have at least 1 unit').max(100, 'Maximum 100 units'),
  otherIncome: z.number().min(0, 'Other income cannot be negative'),
});

// Unit Schema
export const unitSchema = z.object({
  id: z.number(),
  currentRent: z.number().min(0, 'Current rent cannot be negative'),
  repairCosts: z.number().min(0, 'Repair costs cannot be negative'),
  potentialRent: z.number().min(0, 'Potential rent cannot be negative'),
  marketValue: z.number().min(0, 'Market value cannot be negative'),
  bedrooms: z.number().int().min(0, 'Bedrooms cannot be negative').max(10, 'Maximum 10 bedrooms'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative').max(10, 'Maximum 10 bathrooms'),
});

// Renovation Item Schema
export const renovationItemSchema = z.object({
  id: z.number(),
  category: z.string().min(1, 'Category is required'),
  cost: z.number().min(0, 'Cost cannot be negative'),
});

// Expenses Schema
export const expensesFormSchema = z.object({
  // Current Expenses
  currentInsurance: z.number().min(0, 'Insurance cannot be negative'),
  currentPropertyTaxes: z.number().min(0, 'Property taxes cannot be negative'),
  currentMaintenance: z.number().min(0, 'Maintenance cannot be negative'),
  currentManagementPercent: z
    .number()
    .min(0, 'Management percent cannot be negative')
    .max(50, 'Management percent seems too high'),
  currentVacancy: z
    .number()
    .min(0, 'Vacancy rate cannot be negative')
    .max(100, 'Vacancy rate cannot exceed 100%'),
  currentOtherExpenses: z.number().min(0, 'Other expenses cannot be negative'),

  // Projected Expenses
  projectedInsurance: z.number().min(0, 'Insurance cannot be negative'),
  projectedPropertyTaxes: z.number().min(0, 'Property taxes cannot be negative'),
  projectedMaintenance: z.number().min(0, 'Maintenance cannot be negative'),
  projectedManagementPercent: z
    .number()
    .min(0, 'Management percent cannot be negative')
    .max(50, 'Management percent seems too high'),
  projectedVacancy: z
    .number()
    .min(0, 'Vacancy rate cannot be negative')
    .max(100, 'Vacancy rate cannot exceed 100%'),
  projectedOtherExpenses: z.number().min(0, 'Other expenses cannot be negative'),
});

// Financing Schema
export const financingFormSchema = z.object({
  loanAmount: z.number().min(0, 'Loan amount cannot be negative'),
  interestRate: z
    .number()
    .min(0, 'Interest rate cannot be negative')
    .max(30, 'Interest rate seems too high'),
  loanTerm: z
    .number()
    .int()
    .min(1, 'Loan term must be at least 1 year')
    .max(50, 'Loan term cannot exceed 50 years'),
});

// Target Analysis Schema
export const targetAnalysisSchema = z.object({
  targetCapRate: z
    .number()
    .min(0, 'Cap rate cannot be negative')
    .max(50, 'Cap rate seems too high'),
  targetCashOnCash: z
    .number()
    .min(0, 'Cash on cash return cannot be negative')
    .max(100, 'Cash on cash return seems too high'),
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

// Default values
export const defaultPropertyValues = {
  propertyValue: 500000,
  downPayment: 100000,
  closingCosts: 15000,
  renovationCosts: 0,
  numberOfUnits: 1,
  otherIncome: 0,
};

export const defaultExpensesValues = {
  // Current Expenses
  currentInsurance: 200,
  currentPropertyTaxes: 400,
  currentMaintenance: 300,
  currentManagementPercent: 8,
  currentVacancy: 5,
  currentOtherExpenses: 100,

  // Projected Expenses
  projectedInsurance: 250,
  projectedPropertyTaxes: 500,
  projectedMaintenance: 400,
  projectedManagementPercent: 8,
  projectedVacancy: 3,
  projectedOtherExpenses: 150,
};

export const defaultFinancingValues = {
  loanAmount: 400000,
  interestRate: 7.5,
  loanTerm: 30,
};

export const defaultUnitValues = {
  id: 1,
  currentRent: 0,
  repairCosts: 0,
  potentialRent: 0,
  marketValue: 0,
  bedrooms: 0,
  bathrooms: 0,
};

export const defaultTargetAnalysisValues = {
  targetCapRate: 8,
  targetCashOnCash: 12,
};

// Type inference from schemas
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type ExpensesFormData = z.infer<typeof expensesFormSchema>;
export type FinancingFormData = z.infer<typeof financingFormSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type RenovationItemFormData = z.infer<typeof renovationItemSchema>;
export type TargetAnalysisFormData = z.infer<typeof targetAnalysisSchema>;
export type CompleteInvestmentFormData = z.infer<typeof completeInvestmentSchema>;
