export interface ITransUnionProperty {
  propertyName: string;
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
  bankruptcyCheck: boolean;
  bankruptcyTimeFrame: number;
  incomeToRentRatio: number;
  propertyId?: string;
}

export interface IScreeningRequestRenter {
  bundleId: number;
  renterRole: string;
  renterStatus: string;
  createdOn: string; // ISO datetime
  modifiedOn: string; // ISO datetime
  renterFirstName: string;
  renterLastName: string;
  renterMiddleName?: string;
  screeningRequestRenterId: number;
  landlordExternalReferenceId: string;
  renterId: number;
}

export interface IScreeningRequest {
  initialBundleId: number;
  createdOn: string; // ISO datetime
  modifiedOn: string; // ISO datetime
  propertyName: string;
  propertySummaryAddress: string;
  screeningRequestRenters: IScreeningRequestRenter[];
  screeningRequestId: number;
  landlordExternalReferenceId: string;
  propertyId: number;
}
