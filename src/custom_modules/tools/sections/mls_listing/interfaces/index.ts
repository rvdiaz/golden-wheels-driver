export interface IMlsListingItemResponse {
  listingId: string;
  id: string;
  address: {
    address: string;
    label: string;
    state: string;
    zip: string;
    city: string;
  };
  bathrooms: number;
  bedrooms: number;
  yearBuilt: string;
  lotSquareFeet: string;
  mlsLastStatusDate: string;
  mlsListingPrice: number;
  mlsDaysOnMarket: string;
  mlsAgent: {
    email: string;
    fullName: string;
  };
  estimatedEquity: string;
  estimatedValue: string;
  propertyType: string;
  imageUrl: string;
}

export enum ExpiredStatus {
  expired = 'Expired',
  active = 'Active',
  pending = 'Pending',
  sold = 'Sold',
  closed = 'Closed',
}

export interface IExpiredListingForm {
  zipCode: string;
  daysOld: number;
  status: ExpiredStatus;
}
