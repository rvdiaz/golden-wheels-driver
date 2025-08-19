import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { IProperty } from '../interfaces';
import { InfoItem } from './infoItem';
import { formatCurrency } from '../../mortgage_calculator/helpers';
import { Badge } from '~/codidge_components/UI/badge';

export const Property = ({ propertyData }: { propertyData: IProperty }) => {
  const { bedrooms, bathrooms } = propertyData.propertyInfo;
  const bathBed = !!bedrooms && !!bathrooms ? `${bedrooms}BR / ${bathrooms}BA` : undefined;

  const isForeclosure = propertyData.foreclosureInfo.length > 0;
  return (
    <Card style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Icons.Home size={24} color="#2563EB" />
        <Text style={styles.resultTitle}>Property Details</Text>
      </View>
      <InfoItem
        label="Address"
        detailStyles={styles.propertyAddress}
        value={propertyData.propertyInfo.address.address}
      />
      <InfoItem label="Year Built" value={propertyData.propertyInfo.yearBuilt} />
      <InfoItem label="Bedrooms/Bathrooms" value={bathBed} />
      <InfoItem label="Lot Size" value={propertyData.propertyInfo.lotSquareFeet} />
      <InfoItem label="Property type" value={propertyData.propertyType} />
      <InfoItem label="Property use" value={propertyData.propertyInfo.propertyUse} />
      <InfoItem
        label="Estimated Equity"
        value={propertyData.estimatedEquity ? formatCurrency(propertyData.estimatedEquity) : 0}
      />
      <InfoItem
        label="Estimated Value"
        value={propertyData.estimatedValue ? formatCurrency(propertyData.estimatedValue) : 0}
      />
      <Badge type={isForeclosure ? 'success' : 'error'}>
        {isForeclosure ? 'In Foreclosure' : 'No Foreclosure'}
      </Badge>
    </Card>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    padding: 20,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  propertyAddress: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
});
