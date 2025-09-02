import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IMlsListingItemResponse } from '../../interfaces';
import { calculateDaysOnMarket, formatPrice } from '../../helpers';
import { Card } from '~/codidge_components/UI/card';
import { Badge } from '~/codidge_components/UI/badge';

interface PropertyListingCardProps {
  listing: IMlsListingItemResponse;
  onPress?: (listing: IMlsListingItemResponse) => void;
}

const ExpiredListingCard: React.FC<PropertyListingCardProps> = ({ listing, onPress }) => {
  const daysOnMarket = calculateDaysOnMarket(listing.mlsLastStatusDate);

  const conditions = [
    { key: 'absenteeOwner', label: 'Absentee', value: listing.absenteeOwner },
    { key: 'foreclosure', label: 'Foreclosure', value: listing.foreclosure },
    { key: 'preForeclosure', label: 'Pre-Foreclosure', value: listing.preForeclosure },
    { key: 'assumable', label: 'Assumable', value: listing.assumable },
  ];

  return (
    <Card style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress(listing);
          }
        }}>
        {/* Top Section: Image and Basic Info */}
        <View style={styles.topSection}>
          {/* Small Image Preview */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: listing.imageUrl }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            {/* Days on Market Overlay */}
            <View style={[styles.daysOverlay, daysOnMarket === 0 && styles.newListingOverlay]}>
              <Text style={styles.daysText}>{daysOnMarket === 0 ? 'NEW' : `${daysOnMarket}d`}</Text>
            </View>
          </View>

          {/* Right Side Info */}
          <View style={styles.rightInfoContainer}>
            {/* Price and MLS */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(listing.mlsListingPrice)}</Text>
              <Text style={styles.mlsNumber}>MLS: {listing.mlsNumber}</Text>
            </View>

            {/* Address */}
            <Text style={styles.address} numberOfLines={2}>
              {listing.address.address}
              {'\n'}
              {listing.address.city}, {listing.address.state} {listing.address.zip}
            </Text>

            {/* Property Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.bedrooms}</Text>
                <Text style={styles.statLabel}>bed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.bathrooms}</Text>
                <Text style={styles.statLabel}>bath</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.yearBuilt}</Text>
                <Text style={styles.statLabel}>built</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section: Additional Details */}
        <View style={styles.bottomSection}>
          {/* Days on Market Info */}
          <View style={styles.daysOnMarketRow}>
            <View style={styles.daysOnMarketIndicator} />
            <Text style={styles.daysOnMarketText}>{listing.mlsDaysOnMarket} days on market</Text>
          </View>

          {/* Property Conditions */}
          {conditions.some((condition) => condition.value) && (
            <View style={styles.conditionsContainer}>
              {conditions.map(
                (condition, index) =>
                  condition.value && (
                    <Badge
                      key={`${condition.key} ${index}`}
                      style={styles.conditionBadge}
                      textStyle={styles.conditionText}
                      displayIcon={false}
                      type="success">
                      {condition.label}
                    </Badge>
                  )
              )}
            </View>
          )}

          {/* Financial Info */}
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Est. Value</Text>
              <Text style={styles.financialValue}>
                {formatPrice(parseFloat(listing.estimatedValue))}
              </Text>
            </View>
            <View style={styles.financialItemRight}>
              <Text style={styles.financialLabel}>Equity</Text>
              <Text style={styles.equityValue}>
                {formatPrice(parseFloat(listing.estimatedEquity))}
              </Text>
            </View>
          </View>

          {/* Agent Info */}
          <View style={styles.agentRow}>
            <Text style={styles.agentLabel}>Agent:</Text>
            <Text style={styles.agentName} numberOfLines={1}>
              {listing.mlsAgent.fullName}
            </Text>
          </View>
        </View>
        <View style={styles.tapIndicator}>
          <Text style={styles.tapText}>Tap to view details →</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
  },

  // Top Section Styles
  topSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: '40%',
    height: 120,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  daysOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  newListingOverlay: {
    backgroundColor: '#FF5722',
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rightInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  mlsNumber: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 8,
  },
  address: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  statLabel: {
    fontSize: 13,
    color: '#888888',
  },

  // Bottom Section Styles
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  daysOnMarketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  daysOnMarketIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  daysOnMarketText: {
    fontSize: 13,
    color: '#777777',
    fontStyle: 'italic',
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  conditionBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  financialRow: {
    flexDirection: 'row',
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 8,
  },
  financialItem: {
    flex: 1,
  },
  financialItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  financialLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
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
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentLabel: {
    fontSize: 13,
    color: '#888888',
    marginRight: 4,
  },
  agentName: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  tapIndicator: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
  },
  tapText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default ExpiredListingCard;
