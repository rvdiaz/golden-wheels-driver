export interface IProperty {
  ownerInfo: IOwnerInfo;
  propertyInfo: IPropertyInfo;
  estimatedEquity: number;
  estimatedValue: number;
  vacant: boolean;
  mortgageHistory: IMortgageHistoryItem[];
  mlsHistory: IMlsHistoryItem[];
  propertyType: string;
  foreclosureInfo: IForeclosureInfo[];
}

export interface IForeclosureInfo {
  foreclosureId: string;
}

export interface IPropertyInfo {
  address: {
    address: string;
    city: string;
    label: string;
    state: string;
    zip: string;
  };
  bathrooms: number;
  bedrooms: number;
  lotSquareFeet: number;
  yearBuilt: number;
  propertyUse: string;
  landUse: string;
  estimatedValue: string;
}

export interface IMortgageHistoryItem {
  amount: number; // Float
  documentNumber: string | null;
  mortgageId: string;
  open: boolean;
  documentDate: string; // AWSDateTime (ISO date string)
  granteeName: string;
  position: string | null;
  lenderName: string;
  lenderType: string | null;
  term: string | null;
  type: string;
  termType: string | null;
}

export interface IMlsHistoryItem {
  agentEmail: string;
  agentName: string;
  agentOffice: string;
  agentPhone: string;
  baths: number;
  beds: number;
  daysOnMarket: string; // could also be number if you plan to parse it
  lastStatusDate: string; // ISO date string
  price: number;
  propertyId: number;
  seqNo: number;
  status: string;
  statusDate: string; // ISO date string
  type: string;
}

export interface IOwnerInfo {
  fullName?: string;
  phones?: IPhone[];
  email?: IEmail[];
  owner1FirstName?: string;
  owner1LastName?: string;
  mailAddress: IAddress;
}

export interface IPhone {
  phone?: string;
  phoneDisplay?: string;
  doNotCall: boolean;
}

export interface IEmail {
  email?: string;
  emailType?: string;
}

export interface IAddress {
  address?: string;
  label?: string;
  state?: string;
  zip?: string;
}

export interface IOwnerAddress {
  displayName: string;
  formattedAddress: string;
  id: string;
}

export interface PropertyEstimatorAvm {
  id: string;
  apn: string;
  fips: string;
  avm: string;
  avmMin: string;
  avmMax: string;
  confidence: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  zip4: string;
  label: string;
  lastUpdateDate: string; // ISO date string
}
