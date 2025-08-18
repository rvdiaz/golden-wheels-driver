export interface MortgageCalculation {
  monthlyPayment: number;
  principal: number;
  interest: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  totalLoanAmount: number;
  totalInterest: number;
  totalCost: number;
}

export type MortgageFormValues = {
  homePrice: string;
  downPayment: string;
  downPaymentPercent: string;
  interestRate: string;
  loanTerm: string;
  propertyTaxRate: string;
  homeInsurance: string;
  pmiRate: string;
  hoaFees: string;
  zipCode: string;
  city?: string;
};
