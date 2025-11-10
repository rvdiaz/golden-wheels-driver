export interface ITransUnionProperty {
  rent?: number; // Nullable
  deposit?: number; // Nullable
  isActive: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  propertyId?: string;
}

// Base renter input
export interface INewRenterInput {
  income: number;
  incomeFrequency: string;
  otherIncome: number;
  otherIncomeFrequency: string;
  assets: number;
  employmentStatus: string;
  multiShareExpirationDate?: string; // ISO datetime
  emailAddress: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  phoneType?: string;
  homeAddress: ITransUnionProperty;
  acceptedTermsAndConditions: boolean;
  nationalId?: string;
  dateOfBirth?: string; // ISO date
  renterExternalReferenceId?: string;
}

// Extended renter input with additional screening fields
export interface IExtendedRenterInput extends INewRenterInput {
  hasPets: boolean;
  petDescription: string;
  monthlyRent: number;
  reasonForMoving: string;
  landlordName: string;
  landlordPhone: string;
  hasEvicted: boolean;
  evictedDescription: string;
  hasCrimes: boolean;
  crimesDescription: string;
  screeningRequestId: string;
  screeningRequestRenterId: string;
  renterStatus: 'pending' | 'viewed' | 'in_progress' | 'completed';
  reportPdfUrl: string;
  renterReportItems: {
    providerName: string;
    reportData: string;
  }[];
}

export interface IRentApplication {
  rentApplicationId: string;
  property: ITransUnionProperty;
  applicants: IExtendedRenterInput[];
  createdAt: string;
  status: string;
}

export interface IAttestation {
  attestationId: number;
  attestationTypeId: number;
  name: string;
  legalText: string;
  affirmativeRequired: boolean;
  additionalInformation?: string;
}

export interface IAttestationGroup {
  attestationGroupId: number;
  attestations: IAttestation[];
}

export interface AttestationModalProps {
  userId: string;
  propertyId: string;
  visible: boolean;
  attestationGroup: IAttestationGroup | null;
  onAccept: () => void;
  onDecline: () => void;
  loading?: boolean;
  pendingPropertyData: ITransUnionProperty;
}
