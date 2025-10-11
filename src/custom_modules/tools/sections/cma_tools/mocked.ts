export interface ValueEstimate {
  source: string;
  value: number;
  confidence: string;
  lastUpdated: string;
  badge: string;
  color: string;
}

export interface PropertyInfo {
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  imageUrl: string;
}

export const generateMockData = (
  inputAddress: string
): { property: PropertyInfo; estimates: ValueEstimate[] } => {
  // Generate consistent mock data based on address
  const addressHash = inputAddress.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const baseValue = 300000 + (addressHash % 500000);

  const property: PropertyInfo = {
    address: inputAddress,
    bedrooms: 3 + (addressHash % 3),
    bathrooms: 2 + (addressHash % 2),
    sqft: 1500 + (addressHash % 1000),
    yearBuilt: 1980 + (addressHash % 40),
    propertyType: ['Single Family', 'Condo', 'Townhouse'][addressHash % 3],
    imageUrl: `https://images.unsplash.com/photo-1560518821-${(addressHash % 100)
      .toString()
      .padStart(2, '0')}-${((addressHash * 2) % 100).toString().padStart(2, '0')}-${(
      (addressHash * 3) %
      100
    )
      .toString()
      .padStart(2, '0')}`,
  };

  const estimates: ValueEstimate[] = [
    {
      source: 'Zillow Zestimate',
      value: Math.round(baseValue * (1 + ((addressHash % 20) - 10) / 100)),
      confidence: 'Medium',
      lastUpdated: '2 days ago',
      badge: 'Popular',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    {
      source: 'Redfin Estimate',
      value: Math.round(baseValue * (1 + (((addressHash * 2) % 20) - 10) / 100)),
      confidence: 'High',
      lastUpdated: '1 day ago',
      badge: 'Professional',
      color: 'bg-red-50 border-red-200 text-red-800',
    },
    {
      source: 'Realtor.com RVM',
      value: Math.round(baseValue * (1 + (((addressHash * 3) % 20) - 10) / 100)),
      confidence: 'Medium',
      lastUpdated: '3 days ago',
      badge: 'MLS Data',
      color: 'bg-green-50 border-green-200 text-green-800',
    },
    {
      source: 'County Tax Assessment',
      value: Math.round(baseValue * 0.85 * (1 + (((addressHash * 4) % 15) - 7) / 100)),
      confidence: 'Official',
      lastUpdated: '2024 Assessment',
      badge: 'Government',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
    {
      source: 'Comparable Sales Avg',
      value: Math.round(baseValue * (1 + (((addressHash * 5) % 18) - 9) / 100)),
      confidence: 'High',
      lastUpdated: 'Last 6 months',
      badge: 'Market Data',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
    },
  ];

  return { property, estimates };
};
