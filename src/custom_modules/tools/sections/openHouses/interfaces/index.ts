export enum OpenHouseListingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface OpenHouseListing {
  id: string;
  tenantId: string;
  mlsListingId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: OpenHouseListingStatus;
  ownerId: string;
  geoHash?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  mlsNumber: string;
  mlsAgentEmail: string;
  mlsAgentFullName: string;
  mlsLastStatusDate: Date;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: string;
  mlsListingPrice: number;
}

export enum OpenHouseVisitRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface OpenHouseVisitRequest {
  id: string;
  tenantId: string;
  openHouseListingId: string;
  requesterName: string;
  requesterId: string;
  ownerId: string;
  ownerName: string;
  status: OpenHouseVisitRequestStatus;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  message?: string;
  response?: string;
  mlsListingId: string;
  geoHash?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  mlsNumber: string;
}

export type CompositeKey = unknown;
