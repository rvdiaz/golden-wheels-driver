export interface OnboardingFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    mlsNumber: string;
    zipCode: string;
    brokerage: string;
    email: string;
    phone: string;
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
    // Add your financial goals fields here
    shortTermGoals?: string;
    longTermGoals?: string;
    targetAmount?: number;
  };
}
