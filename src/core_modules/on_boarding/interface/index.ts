export interface OnboardingFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    mlsNumber: string;
    brokerage: string;
    email: string;
    phone: string;
    addressLine1: string;
    locality: string;
    region: string;
    country: string;
    postalCode: string;
  };
  visionMission: {
    fiveYear: string;
    oneYear: string;
    statement: string;
    drivesYou: string;
  };
  swotAnalysis: {
    // Add your SWOT analysis fields here
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  financialGoals: {
    desiredAnnualIncome: number;
    avgCommissionBySales: number;
    avgCommissionByRents: number;
  };
}
