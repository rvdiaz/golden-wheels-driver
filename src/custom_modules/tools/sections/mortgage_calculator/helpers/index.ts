export const formatCurrency = (amount: number, digits?: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits ?? 0,
    maximumFractionDigits: digits ?? 0,
  }).format(amount);
};

export const formatCurrencyDetailed = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateMortgage = ({
  homePrice,
  downPayment,
  interestRate,
  loanTerm,
  propertyTaxRate,
  homeInsurance,
  pmiRate,
  hoaFees,
}: {
  homePrice: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
  propertyTaxRate: string;
  homeInsurance: string;
  pmiRate: string;
  hoaFees: string;
}) => {
  const price = parseFloat(homePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const rate = parseFloat(interestRate) || 0;
  const years = parseFloat(loanTerm) || 0;
  const taxRate = parseFloat(propertyTaxRate) || 0;
  const insurance = parseFloat(homeInsurance) || 0;
  const pmi = parseFloat(pmiRate) || 0;
  const hoa = parseFloat(hoaFees) || 0;

  if (price <= 0 || years <= 0 || rate < 0) {
    return;
  }

  // Calculate loan amount
  const loanAmount = price - down;

  // Calculate monthly interest rate
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;

  // Calculate monthly principal & interest using mortgage formula
  let monthlyPI = 0;
  if (monthlyRate > 0) {
    monthlyPI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPI = loanAmount / numPayments;
  }

  // Calculate other monthly costs
  const monthlyTax = (price * (taxRate / 100)) / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyPMI = down < price * 0.2 ? (loanAmount * (pmi / 100)) / 12 : 0;
  const monthlyHOA = hoa;

  // Total monthly payment
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;

  // Total costs over life of loan
  const totalInterest = monthlyPI * numPayments - loanAmount;
  const totalCost =
    price +
    totalInterest +
    monthlyTax * numPayments +
    monthlyInsurance * numPayments +
    monthlyPMI * numPayments +
    monthlyHOA * numPayments;

  return {
    monthlyPayment: totalMonthly,
    principal: monthlyPI - loanAmount * monthlyRate,
    interest: loanAmount * monthlyRate,
    propertyTax: monthlyTax,
    insurance: monthlyInsurance,
    pmi: monthlyPMI,
    hoa: monthlyHOA,
    totalLoanAmount: loanAmount,
    totalInterest,
    totalCost,
  };
};
