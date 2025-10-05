import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { IPropertyInfo } from '../../owner_property_details/interfaces';
import { formatCurrency } from '../../mortgage_calculator/helpers';
import Text from '~/codidge_components/UI/text';

export const CompsProperties = ({ propertiesComps }: { propertiesComps: IPropertyInfo[] }) => {
  const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const renderPropertyCard = ({ item, index }: { item: IPropertyInfo; index: number }) => (
    <View style={styles.propertyCard}>
      {/* Header with property number */}
      <View style={styles.propertyHeader}>
        <View style={styles.propertyNumber}>
          <Text style={styles.propertyNumberText}>#{index + 1}</Text>
        </View>
        <View style={styles.propertyUseContainer}>
          <Text style={styles.propertyUseText}>{item.landUse}</Text>
        </View>
      </View>

      {/* Estimated Value - Prominent Display */}
      <View style={styles.estimationValueContainer}>
        <View style={styles.estimationValueHeader}>
          <MaterialIcons name="monetization-on" size={20} color="#059669" />
          <Text style={styles.estimationValueLabel}>Estimated Value</Text>
        </View>
        <Text style={styles.estimationValueAmount}>
          {formatCurrency(parseFloat(item.estimatedValue))}
        </Text>
      </View>

      {/* Address */}
      <View style={styles.addressContainer}>
        <Feather name="map-pin" size={16} color="#6b7280" />
        <View style={styles.addressText}>
          <Text style={styles.addressLine}>{item.address.address}</Text>
          <Text style={styles.cityStateZip}>
            {item.address.city}, {item.address.state} {item.address.zip}
          </Text>
        </View>
      </View>

      {/* Property Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Bedrooms */}
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="bed" size={18} color="#3b82f6" />
          </View>
          <View>
            <Text style={styles.detailValue}>{item.bedrooms}</Text>
            <Text style={styles.detailLabel}>Bedrooms</Text>
          </View>
        </View>

        {/* Bathrooms */}
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="bathtub" size={18} color="#10b981" />
          </View>
          <View>
            <Text style={styles.detailValue}>{item.bathrooms}</Text>
            <Text style={styles.detailLabel}>Bathrooms</Text>
          </View>
        </View>

        {/* Year Built */}
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="calendar-today" size={18} color="#f59e0b" />
          </View>
          <View>
            <Text style={styles.detailValue}>{item.yearBuilt}</Text>
            <Text style={styles.detailLabel}>Year Built</Text>
          </View>
        </View>

        {/* Lot Size */}
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="landscape" size={18} color="#8b5cf6" />
          </View>
          <View>
            <Text style={styles.detailValue}>{formatSquareFeet(item.lotSquareFeet)}</Text>
            <Text style={styles.detailLabel}>Sq Ft Lot</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (!propertiesComps || propertiesComps.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="home-work" size={48} color="#9ca3af" />
        <Text style={styles.emptyTitle}>No Comparable Properties</Text>
        <Text style={styles.emptySubtitle}>No comparable properties found for this location.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="compare-arrows" size={24} color="#3b82f6" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>Comparable Properties</Text>
          <Text style={styles.sectionSubtitle}>
            {propertiesComps.length} similar properties in the area
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {propertiesComps.map((prop, index) => (
          <View key={`property-${index}`}>
            {renderPropertyCard({ item: prop, index })}
            {index < propertiesComps.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  separator: {
    height: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  propertyNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  propertyUseContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estimationValueContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  estimationValueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimationValueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 6,
  },
  estimationValueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532d',
    textAlign: 'center',
  },
  propertyUseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
  },
  addressLine: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cityStateZip: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  detailIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
