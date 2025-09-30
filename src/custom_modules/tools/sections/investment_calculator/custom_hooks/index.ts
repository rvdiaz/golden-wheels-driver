// hooks/useInvestmentForm.ts
import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  UnitData,
  RenovationItem,
  CalculationResults,
  TargetResults,
  DEFAULT_PROPERTY_VALUES,
  DEFAULT_EXPENSE_VALUES,
  DEFAULT_FINANCING_VALUES,
  DEFAULT_UNIT,
} from '../interfaces';
import { calculateInvestmentAnalysis, calculateTargetAnalysis } from '../helpers';

// Validation schema
const unitSchema = z.object({
  id: z.number(),
  currentRent: z.number().min(0),
  repairCosts: z.number().min(0),
  potentialRent: z.number().min(0),
  marketValue: z.number().min(0),
  bedrooms: z.number().min(0).max(10).optional(),
  bathrooms: z.number().min(0).max(10).optional(),
});

const renovationItemSchema = z.object({
  id: z.number(),
  category: z.string().min(1, 'Category is required'),
  cost: z.number().min(0),
});

const investmentFormSchema = z.object({
  // Property Information
  propertyValue: z.number().min(1, 'Property value must be greater than 0'),
  downPayment: z.number().min(0),
  closingCosts: z.number().min(0),
  renovationCosts: z.number().min(0),
  numberOfUnits: z.number().min(1).max(100),
  otherIncome: z.number().min(0),

  // Current Expenses
  currentInsurance: z.number().min(0),
  currentPropertyTaxes: z.number().min(0),
  currentMaintenance: z.number().min(0),
  currentManagementPercent: z.number().min(0).max(100),
  currentVacancy: z.number().min(0).max(100),
  currentOtherExpenses: z.number().min(0),

  // Projected Expenses
  projectedInsurance: z.number().min(0),
  projectedPropertyTaxes: z.number().min(0),
  projectedMaintenance: z.number().min(0),
  projectedManagementPercent: z.number().min(0).max(100),
  projectedVacancy: z.number().min(0).max(100),
  projectedOtherExpenses: z.number().min(0),

  // Financing
  loanAmount: z.number().min(0),
  interestRate: z.number().min(0).max(50),
  loanTerm: z.number().min(1).max(50),

  // Arrays
  units: z.array(unitSchema),
  renovationItems: z.array(renovationItemSchema),
});

type InvestmentFormSchema = z.infer<typeof investmentFormSchema>;

interface UseInvestmentFormReturn {
  form: UseFormReturn<InvestmentFormSchema>;
  unitsFieldArray: ReturnType<typeof useFieldArray<InvestmentFormSchema, 'units'>>;
  renovationFieldArray: ReturnType<typeof useFieldArray<InvestmentFormSchema, 'renovationItems'>>;
  results: CalculationResults | null;
  targetResults: TargetResults | null;
  isCalculating: boolean;
  showResults: boolean;
  showTargetAnalysis: boolean;
  nextRenovationId: number;

  // Actions
  calculateAnalysis: () => void;
  calculateTarget: (targetCapRate: number, targetCashOnCash: number) => void;
  resetForm: () => void;
  updateUnitsCount: (count: number) => void;
  addRenovationItem: () => void;
  removeRenovationItem: (index: number) => void;
  clearUnit: (index: number) => void;
  removeUnit: (index: number) => void;
  setShowResults: (show: boolean) => void;
  setShowTargetAnalysis: (show: boolean) => void;

  // Computed values
  totalRenovationCost: number;
  totalRepairCosts: number;
  calculatedRenovationTotal: number;
}

const getDefaultFormValues = (): InvestmentFormSchema => ({
  ...DEFAULT_PROPERTY_VALUES,
  ...DEFAULT_EXPENSE_VALUES,
  ...DEFAULT_FINANCING_VALUES,
  units: [{ ...DEFAULT_UNIT, id: 1 }],
  renovationItems: [],
});

export const useInvestmentForm = (): UseInvestmentFormReturn => {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [targetResults, setTargetResults] = useState<TargetResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showTargetAnalysis, setShowTargetAnalysis] = useState(false);
  const [nextRenovationId, setNextRenovationId] = useState(1);

  const form = useForm<InvestmentFormSchema>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: getDefaultFormValues(),
    mode: 'onChange',
  });

  const unitsFieldArray = useFieldArray({
    control: form.control,
    name: 'units',
  });

  const renovationFieldArray = useFieldArray({
    control: form.control,
    name: 'renovationItems',
  });

  // Watch values for calculations
  const watchedValues = form.watch();
  const { units, renovationItems } = watchedValues;

  // Computed values
  const totalRenovationCost =
    renovationItems?.reduce((total, item) => total + (item?.cost || 0), 0) || 0;
  const totalRepairCosts = units?.reduce((total, unit) => total + (unit?.repairCosts || 0), 0) || 0;
  const calculatedRenovationTotal = totalRenovationCost + totalRepairCosts;

  // Auto-update renovation costs when components change
  useEffect(() => {
    form.setValue('renovationCosts', calculatedRenovationTotal);
  }, [calculatedRenovationTotal, form]);

  // Auto-calculate loan amount and closing costs
  useEffect(() => {
    const propertyValue = form.getValues('propertyValue');
    const downPayment = form.getValues('downPayment');

    if (propertyValue && downPayment && propertyValue > downPayment) {
      form.setValue('loanAmount', propertyValue - downPayment);
    }

    // Auto-calculate closing costs at 3% of property value
    const calculatedClosingCosts = Math.round(propertyValue * 0.03);
    form.setValue('closingCosts', calculatedClosingCosts);
  }, [form.watch('propertyValue'), form.watch('downPayment'), form]);

  const updateUnitsCount = useCallback(
    (count: number) => {
      if (count > 0) {
        const currentUnits = form.getValues('units');
        const newUnits: UnitData[] = [];

        // Keep existing units up to the new count
        for (let i = 0; i < count; i++) {
          if (i < currentUnits.length) {
            newUnits.push(currentUnits[i]);
          } else {
            newUnits.push({ ...DEFAULT_UNIT, id: i + 1 });
          }
        }

        form.setValue('numberOfUnits', count);
        form.setValue('units', newUnits);
      }
    },
    [form]
  );

  const addRenovationItem = useCallback(() => {
    const newItem: RenovationItem = {
      id: nextRenovationId,
      category: '',
      cost: 0,
    };
    renovationFieldArray.append(newItem);
    setNextRenovationId((prev) => prev + 1);
  }, [nextRenovationId, renovationFieldArray]);

  const removeRenovationItem = useCallback(
    (index: number) => {
      renovationFieldArray.remove(index);
    },
    [renovationFieldArray]
  );

  const clearUnit = useCallback(
    (index: number) => {
      const clearedUnit: UnitData = {
        ...DEFAULT_UNIT,
        id: index + 1,
      };

      form.setValue(`units.${index}`, clearedUnit);
    },
    [form]
  );

  const removeUnit = useCallback(
    (index: number) => {
      // Remove the unit at the specified index
      unitsFieldArray.remove(index);

      // Update the numberOfUnits count
      const currentCount = form.getValues('numberOfUnits');
      if (currentCount > 1) {
        // Prevent going below 1 unit
        form.setValue('numberOfUnits', currentCount - 1);
      }
    },
    [unitsFieldArray, form]
  );

  const calculateAnalysis = useCallback(async () => {
    setIsCalculating(true);
    setShowResults(false);

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        setIsCalculating(false);
        return;
      }

      const formData = form.getValues();
      const calculationResults = calculateInvestmentAnalysis(formData);

      setResults(calculationResults);
      setShowResults(true);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [form]);

  const calculateTarget = useCallback(
    (targetCapRate: number, targetCashOnCash: number) => {
      if (!results) return;

      const targetData = {
        targetCapRate,
        targetCashOnCash,
      };

      const targetAnalysisResults = calculateTargetAnalysis(results, targetData);
      setTargetResults(targetAnalysisResults);
      setShowTargetAnalysis(true);
    },
    [results]
  );

  const resetForm = useCallback(() => {
    setShowResults(false);
    form.reset(getDefaultFormValues());
    setResults(null);
    setTargetResults(null);
    setShowTargetAnalysis(false);
    setNextRenovationId(1);
  }, [form]);

  return {
    form,
    unitsFieldArray,
    renovationFieldArray,
    results,
    targetResults,
    isCalculating,
    showResults,
    showTargetAnalysis,
    nextRenovationId,

    // Actions
    calculateAnalysis,
    calculateTarget,
    resetForm,
    updateUnitsCount,
    addRenovationItem,
    removeRenovationItem,
    clearUnit,
    removeUnit,
    setShowResults,
    setShowTargetAnalysis,

    // Computed values
    totalRenovationCost,
    totalRepairCosts,
    calculatedRenovationTotal,
  };
};

// Hook for formatting utilities
export const useFormatters = () => {
  const formatCurrency = useCallback((amount: number) => {
    if (amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return '';
  }, []);

  const formatPercentage = useCallback((ratio: number) => {
    if (ratio) {
      return `${ratio.toFixed(2)}%`;
    }
    return '';
  }, []);

  const formatNumber = useCallback((num: number, decimals = 0): string => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
    }).format(num);
  }, []);

  return {
    formatCurrency,
    formatPercentage,
    formatNumber,
  };
};
