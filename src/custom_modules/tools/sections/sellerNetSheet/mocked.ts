export interface NetSheetResult {
  grossSalePrice: number;
  totalDeductions: number;
  netProceeds: number;
  breakdownItems: BreakdownItem[];
}

export interface BreakdownItem {
  category: string;
  description: string;
  amount: number;
  percentage: number;
}

interface GeographicCost {
  transferTax: number;
  titleInsurance: number;
  attorneyFees: number;
  recordingFees: number;
  escrowFees: number;
  propertyTaxRate: number;
  stateName: string;
}

export const GEOGRAPHIC_COSTS: Record<string, GeographicCost> = {
  CA: {
    // California
    transferTax: 0.55,
    titleInsurance: 0.8,
    attorneyFees: 0,
    recordingFees: 150,
    escrowFees: 0.2,
    propertyTaxRate: 0.75,
    stateName: 'California',
  },
  NY: {
    // New York
    transferTax: 4.0,
    titleInsurance: 0.6,
    attorneyFees: 1500,
    recordingFees: 200,
    escrowFees: 0.1,
    propertyTaxRate: 1.68,
    stateName: 'New York',
  },
  NJ: {
    // New Jersey
    transferTax: 1.0,
    titleInsurance: 0.7,
    attorneyFees: 1200,
    recordingFees: 100,
    escrowFees: 0.15,
    propertyTaxRate: 1.79,
    stateName: 'New Jersey',
  },
  FL: {
    // Florida
    transferTax: 0.7,
    titleInsurance: 0.5,
    attorneyFees: 800,
    recordingFees: 75,
    escrowFees: 0.25,
    propertyTaxRate: 0.83,
    stateName: 'Florida',
  },
  TX: {
    // Texas
    transferTax: 0,
    titleInsurance: 0.9,
    attorneyFees: 0,
    recordingFees: 50,
    escrowFees: 0.2,
    propertyTaxRate: 1.6,
    stateName: 'Texas',
  },
  WA: {
    // Washington
    transferTax: 1.28,
    titleInsurance: 0.8,
    attorneyFees: 0,
    recordingFees: 100,
    escrowFees: 0.3,
    propertyTaxRate: 0.94,
    stateName: 'Washington',
  },
  IL: {
    // Illinois
    transferTax: 1.5,
    titleInsurance: 0.7,
    attorneyFees: 1000,
    recordingFees: 150,
    escrowFees: 0.2,
    propertyTaxRate: 2.16,
    stateName: 'Illinois',
  },
  PA: {
    // Pennsylvania
    transferTax: 1.0,
    titleInsurance: 0.5,
    attorneyFees: 1200,
    recordingFees: 100,
    escrowFees: 0.1,
    propertyTaxRate: 1.58,
    stateName: 'Pennsylvania',
  },
  OH: {
    // Ohio
    transferTax: 0.4,
    titleInsurance: 0.6,
    attorneyFees: 800,
    recordingFees: 75,
    escrowFees: 0.15,
    propertyTaxRate: 1.52,
    stateName: 'Ohio',
  },
  GA: {
    // Georgia
    transferTax: 0.1,
    titleInsurance: 0.7,
    attorneyFees: 800,
    recordingFees: 50,
    escrowFees: 0.2,
    propertyTaxRate: 0.83,
    stateName: 'Georgia',
  },
  NC: {
    // North Carolina
    transferTax: 0.2,
    titleInsurance: 0.6,
    attorneyFees: 1000,
    recordingFees: 75,
    escrowFees: 0.15,
    propertyTaxRate: 0.84,
    stateName: 'North Carolina',
  },
  DEFAULT: {
    // National average for other locations
    transferTax: 0.5,
    titleInsurance: 0.7,
    attorneyFees: 800,
    recordingFees: 100,
    escrowFees: 0.2,
    propertyTaxRate: 1.07,
    stateName: 'Other Location',
  },
};

export const detectStateFromZip = (zip: string): string => {
  if (!zip || zip.length < 5) return 'DEFAULT';

  const zipNum = parseInt(zip.substring(0, 5));

  // California: 90000-96699
  if (zipNum >= 90000 && zipNum <= 96699) return 'CA';
  // New York: 10000-14999
  if (zipNum >= 10000 && zipNum <= 14999) return 'NY';
  // New Jersey: 07000-08999
  if (zipNum >= 7000 && zipNum <= 8999) return 'NJ';
  // Florida: 32000-34999
  if (zipNum >= 32000 && zipNum <= 34999) return 'FL';
  // Texas: 75000-79999, 77000-77999
  if ((zipNum >= 75000 && zipNum <= 79999) || (zipNum >= 77000 && zipNum <= 77999)) return 'TX';
  // Washington: 98000-99499
  if (zipNum >= 98000 && zipNum <= 99499) return 'WA';
  // Illinois: 60000-62999
  if (zipNum >= 60000 && zipNum <= 62999) return 'IL';
  // Pennsylvania: 15000-19699
  if (zipNum >= 15000 && zipNum <= 19699) return 'PA';
  // Ohio: 43000-45999
  if (zipNum >= 43000 && zipNum <= 45999) return 'OH';
  // Georgia: 30000-31999
  if (zipNum >= 30000 && zipNum <= 31999) return 'GA';
  // North Carolina: 27000-28999
  if (zipNum >= 27000 && zipNum <= 28999) return 'NC';

  return 'DEFAULT';
};
