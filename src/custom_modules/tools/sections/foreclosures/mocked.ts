export interface MLSListing {
  id: string;
  listDate: string;
  endDate: string;
  listPrice: number;
  finalPrice?: number;
  daysOnMarket: number;
  status: string;
  listingType: string;
  agent: string;
  brokerage: string;
}

export interface ForeclosureProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  caseNumber: string;
  originalLoanAmount: number;
  currentBalance: number;
  auctionDate: string;
  foreclosureStage: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  estimatedValue: number;
  minimumBid?: number;
  trusteeContact?: string;
}

export interface OwnerData {
  ownerName: string;
  coOwnerName?: string;
  phoneNumbers: Array<{
    number: string;
    type: string;
    onDoNotCall: boolean;
    confidence: string;
  }>;
  emailAddresses: Array<{
    email: string;
    type: string;
    confidence: string;
  }>;
  mailingAddress: string;
  occupancyStatus: string;
  equityEstimate: number;
  mlsHistory: MLSListing[];
}

export interface ComparableSale {
  address: string;
  saleDate: string;
  salePrice: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  distance: number;
  daysOnMarket: number;
}

export const generateMockForeclosureProperties = (
  zip: string,
  stage: string,
  maxDate: string
): ForeclosureProperty[] => {
  const zipHash = zip.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const count = 6 + (zipHash % 10);

  const properties: ForeclosureProperty[] = [];
  const streets = [
    'Main St',
    'Oak Ave',
    'Cedar Ln',
    'Pine Dr',
    'Maple Way',
    'Elm St',
    'Park Blvd',
    'River Rd',
    'First St',
    'Second Ave',
  ];
  const propertyTypes = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family'];
  const foreclosureStages = ['Pre-Foreclosure', 'Auction', 'REO/Bank Owned'];
  const trustees = [
    'ABC Trustee Services',
    'First American Title',
    'Stewart Title',
    'Chicago Title',
    'XYZ Legal Services',
  ];

  for (let i = 0; i < count; i++) {
    const seed = zipHash + i;
    const baseLoan = 150000 + (seed % 600000);
    const currentBalance = baseLoan * (0.7 + (seed % 25) / 100);
    const auctionDaysOut = 7 + (seed % 90);

    properties.push({
      id: `FC${seed.toString().slice(-6)}`,
      address: `${100 + (seed % 9999)} ${streets[seed % streets.length]}`,
      city: 'Sample City',
      state: 'FL',
      zipCode: zip,
      caseNumber: `FC-${new Date().getFullYear()}-${(seed * 3).toString().slice(-5)}`,
      originalLoanAmount: Math.round(baseLoan),
      currentBalance: Math.round(currentBalance),
      auctionDate: new Date(Date.now() + auctionDaysOut * 24 * 60 * 60 * 1000).toLocaleDateString(),
      foreclosureStage:
        stage && stage !== 'all' ? stage : foreclosureStages[seed % foreclosureStages.length],
      bedrooms: 2 + (seed % 4),
      bathrooms: 1 + (seed % 3),
      sqft: 1200 + (seed % 2000),
      yearBuilt: 1980 + (seed % 40),
      propertyType: propertyTypes[seed % propertyTypes.length],
      estimatedValue: Math.round(currentBalance * (1.1 + (seed % 30) / 100)),
      minimumBid: Math.round(currentBalance * 0.9),
      trusteeContact: trustees[seed % trustees.length],
    });
  }

  return properties;
};

export const generateMockMLS = (property: ForeclosureProperty): MLSListing[] => {
  const addressHash = property.address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const baseValue = property.estimatedValue;
  const listings: MLSListing[] = [];
  const agents = ['Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'Robert Smith', 'Jennifer Williams'];
  const brokerages = [
    'Coldwell Banker',
    'RE/MAX',
    'Keller Williams',
    'Century 21',
    'Berkshire Hathaway',
  ];
  const statuses = ['Sold', 'Expired', 'Withdrawn', 'Cancelled', 'Leased'];

  const numListings = 2 + (addressHash % 4);

  for (let i = 0; i < numListings; i++) {
    const seed = addressHash + i * 100;
    const isRental = seed % 3 === 0;
    const yearOffset = (i + 1) * 365 + (seed % 365);
    const listDate = new Date(Date.now() - yearOffset * 24 * 60 * 60 * 1000);
    const daysOnMarket = 15 + (seed % 180);
    const endDate = new Date(listDate.getTime() + daysOnMarket * 24 * 60 * 60 * 1000);
    const priceVariation = 0.9 + (seed % 20) / 100;
    const listPrice = Math.round((isRental ? baseValue * 0.005 : baseValue) * priceVariation);
    const status = statuses[seed % statuses.length];

    listings.push({
      id: `MLS${seed.toString().slice(-6)}`,
      listDate: listDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      listPrice: listPrice,
      finalPrice:
        status === 'Sold' || status === 'Leased'
          ? Math.round(listPrice * (0.95 + (seed % 10) / 100))
          : undefined,
      daysOnMarket: daysOnMarket,
      status: status,
      listingType: isRental ? 'For Rent' : 'For Sale',
      agent: agents[seed % agents.length],
      brokerage: brokerages[seed % brokerages.length],
    });
  }

  return listings.sort((a, b) => new Date(b.listDate).getTime() - new Date(a.listDate).getTime());
};

export const generateMockOwnerData = (property: ForeclosureProperty): OwnerData => {
  const seed = property.address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const firstNames = [
    'John',
    'Mary',
    'David',
    'Sarah',
    'Michael',
    'Jennifer',
    'Robert',
    'Lisa',
    'James',
    'Michelle',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
  ];

  const ownerName = `${firstNames[seed % firstNames.length]} ${
    lastNames[(seed + 1) % lastNames.length]
  }`;
  const phoneNumber = `(${200 + (seed % 799)}) ${100 + (seed % 899)}-${1000 + (seed % 8999)}`;
  const email = `${ownerName.toLowerCase().replace(' ', '.')}@email.com`;

  const mlsHistory = generateMockMLS(property);

  return {
    ownerName,
    phoneNumbers: [
      {
        number: phoneNumber,
        type: 'Mobile',
        onDoNotCall: false,
        confidence: 'High',
      },
    ],
    emailAddresses: [
      {
        email: email,
        type: 'Personal',
        confidence: 'Medium',
      },
    ],
    mailingAddress: property.address,
    occupancyStatus: seed % 3 === 0 ? 'Vacant' : 'Owner Occupied',
    equityEstimate: Math.max(0, property.estimatedValue - property.currentBalance),
    mlsHistory: mlsHistory,
  };
};

export const generateMockComparableSales = (property: ForeclosureProperty): ComparableSale[] => {
  const seed = property.address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const count = 3 + (seed % 4);

  const comparables: ComparableSale[] = [];
  const streets = ['Main St', 'Oak Ave', 'Cedar Ln', 'Pine Dr', 'Maple Way'];

  for (let i = 0; i < count; i++) {
    const compSeed = seed + i;
    const priceVariation = 0.85 + (compSeed % 30) / 100;
    const daysSold = 30 + (compSeed % 180);

    comparables.push({
      address: `${100 + (compSeed % 9999)} ${streets[compSeed % streets.length]}`,
      saleDate: new Date(Date.now() - daysSold * 24 * 60 * 60 * 1000).toLocaleDateString(),
      salePrice: Math.round(property.estimatedValue * priceVariation),
      bedrooms: property.bedrooms + ((compSeed % 3) - 1),
      bathrooms: property.bathrooms,
      sqft: property.sqft + ((compSeed % 400) - 200),
      distance: 0.1 + (compSeed % 20) / 10,
      daysOnMarket: 15 + (compSeed % 120),
    });
  }

  return comparables.sort((a, b) => a.distance - b.distance);
};
