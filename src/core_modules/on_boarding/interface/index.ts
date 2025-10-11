export interface OnboardingFormData {
  personalInfo: IPersonalData;
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

export interface IPersonalData {
  firstName: string;
  lastName: string;
  mlsNumber: string;
  brokerage: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
}
