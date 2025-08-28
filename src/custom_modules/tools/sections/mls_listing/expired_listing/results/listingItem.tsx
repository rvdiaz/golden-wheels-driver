import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { IMlsListingItemResponse } from '../../interfaces';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { formatNumber, formatPrice } from '../../helpers';
import { Card } from '~/codidge_components/UI/card';

// Get screen dimensions for responsive design
const { width: screenWidth } = Dimensions.get('window');

interface PropertyListingCardProps {
  listing: IMlsListingItemResponse;
  onPress?: (listing: IMlsListingItemResponse) => void;
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ listing, onPress }) => {
  // Calculate equity percentage if both values are available
  const getEquityPercentage = (): string => {
    const equity = parseFloat(listing.estimatedEquity);
    const value = parseFloat(listing.estimatedValue);
    if (equity && value && value > 0) {
      return `${((equity / value) * 100).toFixed(1)}%`;
    }
    return '';
  };

  return (
    <Card style={styles.cardContainer}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.imageUrl }} style={styles.propertyImage} resizeMode="cover" />

        {/* Property Type Badge */}
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText}>{listing.propertyType}</Text>
        </View>

        {/* Days on Market Badge */}
        <View style={styles.daysOnMarketBadge}>
          <Text style={styles.daysOnMarketText}>{listing.mlsDaysOnMarket} days</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Price and Address Section */}
        <View style={styles.headerSection}>
          <Text style={styles.price}>{formatPrice(listing.mlsListingPrice)}</Text>
          <Text style={styles.address}>{listing.address.address}</Text>
          <Text style={styles.cityState}>
            {listing.address.city}, {listing.address.state} {listing.address.zip}
          </Text>
        </View>

        {/* Property Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{listing.bedrooms}</Text>
            <Text style={styles.detailLabel}>Beds</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{listing.bathrooms}</Text>
            <Text style={styles.detailLabel}>Baths</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{formatNumber(listing.lotSquareFeet)}</Text>
            <Text style={styles.detailLabel}>Sq Ft</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{listing.yearBuilt}</Text>
            <Text style={styles.detailLabel}>Built</Text>
          </View>
        </View>

        {/* Financial Information */}
        <View style={styles.financialSection}>
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Est. Value</Text>
              <Text style={styles.financialValue}>
                {formatPrice(parseFloat(listing.estimatedValue))}
              </Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Est. Equity</Text>
              <Text style={styles.equityValue}>
                {formatPrice(parseFloat(listing.estimatedEquity))}
              </Text>
              {getEquityPercentage() && (
                <Text style={styles.equityPercentage}>{getEquityPercentage()}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Agent Information */}
        <View style={styles.agentSection}>
          <Text style={styles.agentLabel}>Listed by</Text>
          <Text style={styles.agentName}>{listing.mlsAgent.fullName}</Text>
        </View>
        {/* Agent Information */}
        <View style={{ marginTop: 16 }}>
          <OutlineButton title="Get Owner Information" />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  propertyTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  propertyTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  daysOnMarketBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysOnMarketText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  cityState: {
    fontSize: 14,
    color: '#666666',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'uppercase',
  },
  financialSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialItem: {
    flex: 1,
  },
  financialLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  equityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  equityPercentage: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  agentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
  },
  agentLabel: {
    fontSize: 12,
    color: '#888888',
    marginRight: 8,
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
});

export default PropertyListingCard;
