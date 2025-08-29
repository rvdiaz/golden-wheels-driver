import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { IMlsListingItemResponse } from '../../interfaces';
import { calculateDaysOnMarket, formatPrice } from '../../helpers';
import { Card } from '~/codidge_components/UI/card';
import { Badge } from '~/codidge_components/UI/badge';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { PhoneCall } from 'lucide-react-native';

interface PropertyDetailScreenProps {
  listing: IMlsListingItemResponse;
  onClose: () => void;
  imageAnimatedValue?: Animated.Value; // For shared element animation
}

const ExpiredListingDetail: React.FC<PropertyDetailScreenProps> = ({
  listing,
  onClose,
  imageAnimatedValue,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const daysOnMarket = calculateDaysOnMarket(listing.mlsLastStatusDate);

  const conditions = [
    { key: 'absenteeOwner', label: 'Absentee Owner', value: listing.absenteeOwner },
    { key: 'foreclosure', label: 'Foreclosure', value: listing.foreclosure },
    { key: 'preForeclosure', label: 'Pre-Foreclosure', value: listing.preForeclosure },
    { key: 'assumable', label: 'Assumable', value: listing.assumable },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: 200, // Delay to let image animation finish
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Hero Image Section */}
        <View style={styles.heroImageContainer}>
          <Animated.Image
            source={{ uri: listing.imageUrl }}
            style={[
              styles.heroImage,
              imageAnimatedValue && {
                transform: [
                  {
                    scale: imageAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1], // Scale from small card size to full
                    }),
                  },
                ],
              },
            ]}
            resizeMode="cover"
          />

          {/* Overlay Info on Image */}
          <View style={styles.imageOverlay}>
            <View style={[styles.daysOverlay, daysOnMarket === 0 && styles.newListingOverlay]}>
              <Text style={styles.daysText}>
                {daysOnMarket === 0 ? 'NEW LISTING' : `${daysOnMarket} DAYS ON MARKET`}
              </Text>
            </View>

            <View style={styles.priceOverlay}>
              <Text style={styles.heroPrice}>{formatPrice(listing.mlsListingPrice)}</Text>
              <Text style={styles.mlsNumberOverlay}>MLS: {listing.mlsNumber}</Text>
            </View>
          </View>
        </View>

        {/* Animated Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          {/* Main Property Info Card */}
          <Card style={styles.mainInfoCard}>
            <Text style={styles.address}>{listing.address.address}</Text>
            <Text style={styles.cityState}>
              {listing.address.city}, {listing.address.state} {listing.address.zip}
            </Text>

            {/* Property Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.bedrooms}</Text>
                <Text style={styles.statLabel}>Bedrooms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.bathrooms}</Text>
                <Text style={styles.statLabel}>Bathrooms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listing.yearBuilt}</Text>
                <Text style={styles.statLabel}>Year Built</Text>
              </View>
            </View>
          </Card>

          {/* Market Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>Market Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Days on Market</Text>
              <Text style={styles.infoValue}>{listing.mlsDaysOnMarket} days</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Listing Status</Text>
              <Text style={styles.infoValue}>Expired</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Status Date</Text>
              <Text style={styles.infoValue}>
                {new Date(listing.mlsLastStatusDate).toLocaleDateString()}
              </Text>
            </View>
          </Card>

          {/* Financial Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>Financial Details</Text>
            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>List Price</Text>
                <Text style={styles.financialValue}>{formatPrice(listing.mlsListingPrice)}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Estimated Value</Text>
                <Text style={styles.financialValuePositive}>
                  {formatPrice(parseFloat(listing.estimatedValue))}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Estimated Equity</Text>
                <Text style={styles.financialValuePositive}>
                  {formatPrice(parseFloat(listing.estimatedEquity))}
                </Text>
              </View>
            </View>
          </Card>

          {/* Property Conditions */}
          {conditions.some((condition) => condition.value) && (
            <Card style={styles.infoCard}>
              <Text style={styles.cardTitle}>Property Conditions</Text>
              <View style={styles.conditionsGrid}>
                {conditions.map(
                  (condition) =>
                    condition.value && (
                      <Badge
                        key={condition.key}
                        style={styles.conditionBadgeLarge}
                        textStyle={styles.conditionTextLarge}
                        displayIcon={false}
                        type="success">
                        {condition.label}
                      </Badge>
                    )
                )}
              </View>
            </Card>
          )}

          {/* Agent Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>Listing Agent</Text>
            <View style={styles.agentInfo}>
              <View style={styles.agentDetails}>
                <Text style={styles.agentName}>{listing.mlsAgent.fullName}</Text>
                {listing.mlsAgent.email && (
                  <Text style={styles.agentCompany}>{listing.mlsAgent.email}</Text>
                )}
                {listing.mlsAgent.fullName && (
                  <Text style={styles.agentContact}>📞 {listing.mlsAgent.fullName}</Text>
                )}
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
        </Animated.View>
      </ScrollView>
      <View style={styles.actionButtonsContainer}>
        <PrimaryButton
          style={{ flex: 1 }}
          size={ButtonSize.LARGE}
          title="Contact Owner"
          rightWidget={<PhoneCall size={16} color="#fff" />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  heroImageContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  daysOverlay: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newListingOverlay: {
    backgroundColor: '#EF4444',
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  priceOverlay: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  heroPrice: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
  },
  mlsNumberOverlay: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  contentContainer: {
    padding: 16,
  },
  mainInfoCard: {
    padding: 20,
    marginBottom: 16,
  },
  address: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cityState: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  financialItem: {
    width: '50%',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  financialLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  financialValuePositive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  conditionTextLarge: {
    fontSize: 12,
    fontWeight: '600',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  agentCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  agentContact: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ExpiredListingDetail;
