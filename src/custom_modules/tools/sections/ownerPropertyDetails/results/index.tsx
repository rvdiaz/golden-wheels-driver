import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { Owner } from './owner';

const propertyData = {
  address: `sdsdsd`,
  owner: {
    name: 'John & Mary Smith',
    mailingAddress: '123 Oak Street, Springfield, IL 62701',
    phone: '(555) 123-4567',
  },
  property: {
    yearBuilt: '1995',
    squareFeet: '2,450 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    lotSize: '0.25 acres',
    propertyType: 'Single Family Residential',
    assessedValue: '$285,000',
    marketValue: '$320,000',
    lastSaleDate: 'March 15, 2018',
    lastSalePrice: '$275,000',
  },
  tax: {
    annualTax: '$3,420',
    taxRate: '1.2%',
    exemptions: 'Homestead',
  },
  mortgage: {
    lender: 'First National Bank',
    loanAmount: '$220,000',
    loanDate: 'March 2018',
    loanType: 'Conventional 30-year',
  },
};

export const PropertyOwnerResults = ({ propertyData }: { propertyData: IProperty }) => {
  return (
    <>
      <Property propertyData={propertyData} />
      <Owner ownerInfo={propertyData.ownerInfo} />
    </>
  );
};
