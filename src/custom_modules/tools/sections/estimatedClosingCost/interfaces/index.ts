export interface EstimatedClosingCostFormValues {
  purchasePrice: string;
  downPayment: string;
  downPaymentPercent: string;
  buyerBrokerComp: string;
  buyerBrokerCompPercent: string;
  originationPoints: string;
  appraisalFee: string;
  inspectionFee: string;
  creditReportFee: string;
  surveyFee: string;
  recordingFees: string;
  prepaidTaxes: string;
  prepaidInsurance: string;
  prepaidHOA: string;
  escrowFee: string;
}

export interface EstimatedClosingCostCalculatorFormProps {
  isDownPaymentPercent: boolean;
  setIsDownPaymentPercent: (value: boolean) => void;
  isBuyerBrokerPercent: boolean;
  setIsBuyerBrokerPercent: (value: boolean) => void;
}

export interface CostBreakdownItem {
  category: string;
  description: string;
  amount: number;
  editable?: boolean;
  percentage?: number;
}

export interface ClosingCostResult {
  purchasePrice: number;
  downPaymentAmount: number;
  loanAmount: number;
  totalClosingCosts: number;
  totalCashNeeded: number;
  breakdown: CostBreakdownItem[];
}
