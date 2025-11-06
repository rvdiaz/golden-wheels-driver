import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatSquareFeet = (sqft: number) => {
  return new Intl.NumberFormat('en-US').format(sqft);
};

export const MarketValueCard = ({
  averageValue,
  propertyInfo,
}: {
  averageValue: string;
  propertyInfo: IPropertyInfo;
}) => {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#f0fdf4', '#eff6ff']} // from-green-50 to-blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}>
        <View style={styles.cardContent}>
          {/* Header with icon and title */}
          <View style={styles.header}>
            <Feather name="trending-up" size={20} color="#059669" />
            <Text style={styles.title}>Property Market Analysis</Text>
          </View>

          {/* Main value */}
          <Text style={styles.mainValue}>{formatCurrency(parseFloat(averageValue))}</Text>
          <Text style={styles.valueLabel}>Average Market Value</Text>

          {/* Property Address */}
          {propertyInfo && (
            <View style={styles.addressContainer}>
              <Feather name="map-pin" size={14} color="#065f46" />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>
                  {propertyInfo?.address?.address}, {propertyInfo?.address?.state}{' '}
                  {propertyInfo?.address?.zip}
                </Text>
              </View>
            </View>
          )}
          {/* Property Details Grid */}
          {propertyInfo && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailsGrid}>
                {/* Bedrooms & Bathrooms */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="bed" size={16} color="#059669" />
                    <Text style={styles.detailText}>{propertyInfo.bedrooms} Beds</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="bathtub" size={16} color="#059669" />
                    <Text style={styles.detailText}>{propertyInfo.bathrooms} Baths</Text>
                  </View>
                </View>

                {/* Year Built & Lot Size */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="calendar-today" size={16} color="#059669" />
                    <Text style={styles.detailText}>Built {propertyInfo.yearBuilt}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="landscape" size={16} color="#059669" />
                    <Text style={styles.detailText}>
                      {formatSquareFeet(propertyInfo.lotSquareFeet)} sq ft
                    </Text>
                  </View>
                </View>

                {/* Property Use & Land Use */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="home" size={16} color="#059669" />
                    <Text style={styles.detailText}>{propertyInfo.propertyUse}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1e293b',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    padding: 28,
    alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  valueLabel: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    marginLeft: 12,
    flex: 1,
  },
  addressLine: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  detailsGrid: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 16,
  },
});
