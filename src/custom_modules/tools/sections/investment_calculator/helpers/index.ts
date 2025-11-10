// utils/investmentCalculations.ts

import {
  InvestmentFormData,
  CalculationResults,
  ProjectionData,
  TargetAnalysisData,
  TargetResults,
  UnitData,
} from '../interfaces';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (ratio: number): string => {
  return `${ratio.toFixed(2)}%`;
};

export const calculateMonthlyMortgagePayment = (
  principal: number,
  rate: number,
  years: number
): number => {
  if (principal <= 0) return 0;

  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) return principal / numPayments;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
};

export const calculateProjections = (
  potentialAnnualRentalIncome: number,
  annualOtherIncome: number,
  projectedVacancyRate: number,
  projectedOperatingExpenses: number,
  annualDebtService: number,
  propertyValue: number,
  currentLoanBalance: number,
  monthlyMortgagePayment: number,
  interestRate: number,
  loanTermYears: number,
  years: number
): ProjectionData => {
  const rentGrowthRate = 0.05; // 5% annual rent increase
  const appreciationRate = 0.03; // 3% annual property appreciation

  const futureRent = potentialAnnualRentalIncome * Math.pow(1 + rentGrowthRate, years);
  const futureGrossIncome = futureRent + annualOtherIncome;
  const futureEffectiveIncome = futureGrossIncome * (1 - projectedVacancyRate);
  const futureNOI = futureEffectiveIncome - projectedOperatingExpenses;
  const futureCashFlow = futureNOI - annualDebtService;

  const futurePropertyValue = propertyValue * Math.pow(1 + appreciationRate, years);

  // Calculate equity (property value - remaining loan balance)
  const monthlyPayments = years * 12;
  const monthlyRate = interestRate / 100 / 12;
  let remainingBalance = currentLoanBalance;

  if (monthlyRate > 0 && currentLoanBalance > 0) {
    const totalPayments = loanTermYears * 12;
    const paymentsRemaining = totalPayments - monthlyPayments;
    if (paymentsRemaining > 0) {
      remainingBalance =
        monthlyMortgagePayment *
        ((Math.pow(1 + monthlyRate, paymentsRemaining) - 1) /
          (monthlyRate * Math.pow(1 + monthlyRate, paymentsRemaining)));
    } else {
      remainingBalance = 0;
    }
  } else if (currentLoanBalance > 0) {
    remainingBalance = Math.max(0, currentLoanBalance - monthlyMortgagePayment * monthlyPayments);
  }

  const equity = futurePropertyValue - Math.max(0, remainingBalance);
  const futureCapRate = futurePropertyValue > 0 ? (futureNOI / futurePropertyValue) * 100 : 0;

  return {
    rent: futureRent,
    propertyValue: futurePropertyValue,
    cashFlow: futureCashFlow,
    equity: equity,
    capRate: futureCapRate,
    roi: 0, // This would need total cash invested to calculate
  };
};

export const calculateInvestmentAnalysis = (formData: InvestmentFormData): CalculationResults => {
  const { units, otherIncome } = formData;

  // Calculate current and potential income from units
  const currentAnnualRentalIncome = units.reduce((total, unit) => total + unit.currentRent * 12, 0);
  const potentialAnnualRentalIncome = units.reduce(
    (total, unit) => total + unit.potentialRent * 12,
    0
  );
  const totalRepairCosts = units.reduce((total, unit) => total + unit.repairCosts, 0);

  const annualOtherIncome = otherIncome * 12;
  const currentGrossIncome = currentAnnualRentalIncome + annualOtherIncome;
  const potentialGrossIncome = potentialAnnualRentalIncome + annualOtherIncome;

  // Vacancy adjustment
  const currentVacancyRate = formData.currentVacancy / 100;
  const projectedVacancyRate = formData.projectedVacancy / 100;
  const currentEffectiveIncome = currentGrossIncome * (1 - currentVacancyRate);
  const potentialEffectiveIncome = potentialGrossIncome * (1 - projectedVacancyRate);

  // Annual expenses - Current
  const currentAnnualInsurance = formData.currentInsurance * 12;
  const currentAnnualPropertyTaxes = formData.currentPropertyTaxes * 12;
  const currentAnnualMaintenance = formData.currentMaintenance * 12;
  const currentAnnualOtherExpenses = formData.currentOtherExpenses * 12;

  // Annual expenses - Projected
  const projectedAnnualInsurance = formData.projectedInsurance * 12;
  const projectedAnnualPropertyTaxes = formData.projectedPropertyTaxes * 12;
  const projectedAnnualMaintenance = formData.projectedMaintenance * 12;
  const projectedAnnualOtherExpenses = formData.projectedOtherExpenses * 12;

  // Management fees
  const currentManagementRate = formData.currentManagementPercent / 100;
  const projectedManagementRate = formData.projectedManagementPercent / 100;
  const currentManagementFees = currentEffectiveIncome * currentManagementRate;
  const projectedManagementFees = potentialEffectiveIncome * projectedManagementRate;

  const currentOperatingExpenses =
    currentAnnualInsurance +
    currentAnnualPropertyTaxes +
    currentAnnualMaintenance +
    currentManagementFees +
    currentAnnualOtherExpenses;
  const projectedOperatingExpenses =
    projectedAnnualInsurance +
    projectedAnnualPropertyTaxes +
    projectedAnnualMaintenance +
    projectedManagementFees +
    projectedAnnualOtherExpenses;

  // Net Operating Income
  const currentNOI = currentEffectiveIncome - currentOperatingExpenses;
  const projectedNOI = potentialEffectiveIncome - projectedOperatingExpenses;

  // Mortgage payment
  const monthlyMortgagePayment =
    formData.loanAmount > 0
      ? calculateMonthlyMortgagePayment(
          formData.loanAmount,
          formData.interestRate as number,
          formData.loanTerm
        )
      : 0;
  const annualDebtService = monthlyMortgagePayment * 12;

  // Cash flow
  const currentCashFlow = currentNOI - annualDebtService;
  const projectedCashFlow = projectedNOI - annualDebtService;

  // Cap rates
  const currentCapRate = (currentNOI / formData.propertyValue) * 100;
  const improvedPropertyValue = formData.propertyValue + totalRepairCosts;
  const projectedCapRate = (projectedNOI / improvedPropertyValue) * 100;

  // Value gain calculation
  const valueGain = (projectedNOI - currentNOI) / (currentCapRate / 100);

  // Cash-on-cash return
  const totalCashInvested = formData.downPayment + formData.closingCosts + formData.renovationCosts;
  const cashOnCashReturn =
    totalCashInvested > 0 ? (projectedCashFlow / totalCashInvested) * 100 : 0;

  // Debt Service Coverage Ratio (DSCR)
  const debtServiceCoverageRatio = annualDebtService > 0 ? projectedNOI / annualDebtService : 0;

  // 3-year and 5-year projections
  const year3Projection = calculateProjections(
    potentialAnnualRentalIncome,
    annualOtherIncome,
    projectedVacancyRate,
    projectedOperatingExpenses,
    annualDebtService,
    formData.propertyValue,
    formData.loanAmount,
    monthlyMortgagePayment,
    formData.interestRate as number,
    formData.loanTerm,
    3
  );

  const year5Projection = calculateProjections(
    potentialAnnualRentalIncome,
    annualOtherIncome,
    projectedVacancyRate,
    projectedOperatingExpenses,
    annualDebtService,
    formData.propertyValue,
    formData.loanAmount,
    monthlyMortgagePayment,
    formData.interestRate as number,
    formData.loanTerm,
    5
  );

  // Calculate ROI for projections
  year3Projection.roi =
    totalCashInvested > 0 ? (year3Projection.cashFlow / totalCashInvested) * 100 : 0;
  year5Projection.roi =
    totalCashInvested > 0 ? (year5Projection.cashFlow / totalCashInvested) * 100 : 0;

  return {
    totalIncome: potentialEffectiveIncome,
    totalExpenses: projectedOperatingExpenses,
    netOperatingIncome: projectedNOI,
    capRate: projectedCapRate,
    cashOnCashReturn,
    totalCashInvested,
    annualCashFlow: projectedCashFlow,
    units: units,
    currentCapRate,
    improvedCapRate: projectedCapRate,
    totalRepairCosts,
    totalIncomeIncrease: potentialAnnualRentalIncome - currentAnnualRentalIncome,
    valueGain,
    debtServiceCoverageRatio,
    projections: {
      year3: year3Projection,
      year5: year5Projection,
    },
  };
};

export const calculateTargetAnalysis = (
  results: CalculationResults,
  targetData: TargetAnalysisData
): TargetResults => {
  const targetCapRateDecimal = targetData.targetCapRate / 100;
  const targetCashOnCashDecimal = targetData.targetCashOnCash / 100;

  // Calculate price based on desired cap rate
  const capRateBasedPrice = results.netOperatingIncome / targetCapRateDecimal;

  // Calculate price based on desired cash-on-cash return
  const totalCashInvested = results.totalCashInvested;
  const desiredCashFlow = totalCashInvested * targetCashOnCashDecimal;
  const currentDebtService = results.netOperatingIncome - results.annualCashFlow;
  const requiredNOI = desiredCashFlow + currentDebtService;
  const cashOnCashBasedPrice = requiredNOI / targetCapRateDecimal;

  // Recommended price is the lower of the two (more conservative)
  const recommendedPrice = Math.min(capRateBasedPrice, cashOnCashBasedPrice);
  const maxOfferPrice = recommendedPrice * 0.9;

  return {
    recommendedPurchasePrice: recommendedPrice,
    maxOfferPrice: maxOfferPrice,
    capRateBasedPrice: capRateBasedPrice,
    cashOnCashBasedPrice: cashOnCashBasedPrice,
  };
};

export const calculateUnitAnalysis = (unit: UnitData) => {
  const monthlyGain = unit.potentialRent - unit.currentRent;
  const annualGain = monthlyGain * 12;
  const repairROI = unit.repairCosts > 0 ? (annualGain / unit.repairCosts) * 100 : 0;

  return {
    monthlyGain,
    annualGain,
    repairROI,
  };
};
