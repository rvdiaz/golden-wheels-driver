import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import {
  Search,
  MapPin,
  TrendingUp,
  Building,
  Info,
  DollarSign,
  Eye,
  Star,
  Calendar,
} from 'lucide-react-native';
import { generateMockData, PropertyInfo, ValueEstimate } from './mocked';

export const CmaComparativesPage = () => {
  const navigation = useNavigation();

  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [valueEstimates, setValueEstimates] = useState<ValueEstimate[]>([]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAnalyze = async () => {
    if (!address.trim()) {
      alert('Please enter a property address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockData = generateMockData(address.trim());
      setPropertyInfo(mockData.property);
      setValueEstimates(mockData.estimates);
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing property:', error);
      alert('Error analyzing property');
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setAddress('');
    setShowResults(false);
    setPropertyInfo(null);
    setValueEstimates([]);
  };

  const averageValue =
    valueEstimates.length > 0
      ? valueEstimates.reduce((sum, est) => sum + est.value, 0) / valueEstimates.length
      : 0;

  const getColorStyles = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'bg-blue-50 border-blue-200 text-blue-800': {
        bg: '#eff6ff',
        text: '#1e40af',
        border: '#bfdbfe',
      },
      'bg-red-50 border-red-200 text-red-800': {
        bg: '#fef2f2',
        text: '#991b1b',
        border: '#fecaca',
      },
      'bg-green-50 border-green-200 text-green-800': {
        bg: '#f0fdf4',
        text: '#166534',
        border: '#bbf7d0',
      },
      'bg-purple-50 border-purple-200 text-purple-800': {
        bg: '#faf5ff',
        text: '#6b21a8',
        border: '#e9d5ff',
      },
      'bg-orange-50 border-orange-200 text-orange-800': {
        bg: '#fff7ed',
        text: '#9a3412',
        border: '#fed7aa',
      },
    };
    return colorMap[color] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  };

  if (showResults && propertyInfo) {
    return (
      <PageSafeContainer>
        <Header title="Market Analysis Results" showBack={true} onBack={resetCalculator} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Property Address */}
          <View style={styles.headerSection}>
            <Text style={styles.addressText}>{propertyInfo.address}</Text>
            <TouchableOpacity style={styles.newAnalysisButton} onPress={resetCalculator}>
              <Text style={styles.newAnalysisButtonText}>New Analysis</Text>
            </TouchableOpacity>
          </View>

          {/* Property Image */}
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop&crop=center',
                }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
              <View style={styles.imageBadge}>
                <Eye color="#374151" size={14} />
                <Text style={styles.imageBadgeText}>Street View</Text>
              </View>
            </View>
            <View style={styles.propertyDetails}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Bedrooms</Text>
                <Text style={styles.detailValue}>{propertyInfo.bedrooms}</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Bathrooms</Text>
                <Text style={styles.detailValue}>{propertyInfo.bathrooms}</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Square Feet</Text>
                <Text style={styles.detailValue}>{propertyInfo.sqft.toLocaleString()}</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Year Built</Text>
                <Text style={styles.detailValue}>{propertyInfo.yearBuilt}</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{propertyInfo.propertyType}</Text>
              </View>
            </View>
          </View>

          {/* Average Value Summary */}
          <View style={styles.averageCard}>
            <View style={styles.averageHeader}>
              <TrendingUp color="#16a34a" size={20} />
              <Text style={styles.averageTitle}>Average Market Value</Text>
            </View>
            <Text style={styles.averageValue}>{formatCurrency(averageValue)}</Text>
            <Text style={styles.averageSubtext}>Based on {valueEstimates.length} data sources</Text>
          </View>

          {/* Value Estimates */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Building color="#111827" size={20} />
              <Text style={styles.sectionTitle}>Value Estimates by Source</Text>
            </View>

            {valueEstimates.map((estimate, index) => {
              const colors = getColorStyles(estimate.color);
              const percentDiff = ((estimate.value - averageValue) / averageValue) * 100;

              return (
                <View
                  key={index}
                  style={[
                    styles.estimateCard,
                    {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    },
                  ]}>
                  <View style={styles.estimateContent}>
                    <View style={styles.estimateLeft}>
                      <View style={styles.estimateIcon}>
                        <DollarSign color={colors.text} size={24} />
                      </View>
                      <View style={styles.estimateInfo}>
                        <View style={styles.estimateHeaderRow}>
                          <Text style={[styles.estimateSource, { color: colors.text }]}>
                            {estimate.source}
                          </Text>
                          <View style={styles.estimateBadge}>
                            <Text style={styles.estimateBadgeText}>{estimate.badge}</Text>
                          </View>
                        </View>
                        <View style={styles.estimateMeta}>
                          <View style={styles.estimateMetaItem}>
                            <Star color="#6b7280" size={12} />
                            <Text style={styles.estimateMetaText}>
                              {estimate.confidence} Confidence
                            </Text>
                          </View>
                          <View style={styles.estimateMetaItem}>
                            <Calendar color="#6b7280" size={12} />
                            <Text style={styles.estimateMetaText}>{estimate.lastUpdated}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.estimateRight}>
                      <Text style={[styles.estimateValue, { color: colors.text }]}>
                        {formatCurrency(estimate.value)}
                      </Text>
                      <Text style={styles.estimateDiff}>
                        {percentDiff > 0 ? '+' : ''}
                        {percentDiff.toFixed(1)}% from avg
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Info color="#ea580c" size={16} />
            <Text style={styles.disclaimerText}>
              <Text style={styles.disclaimerBold}>Important:</Text> These are sample estimates for
              demonstration purposes. Real property valuations require professional appraisal,
              market analysis, and physical inspection of the property condition and unique
              features.
            </Text>
          </View>
        </ScrollView>
      </PageSafeContainer>
    );
  }

  return (
    <PageSafeContainer>
      <Header
        title="CMA"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Search color="#7c3aed" size={24} />
            <View style={styles.flex1}>
              <Text style={styles.cardTitle}>Comparative Market Analysis (CMA)</Text>
              <Text style={styles.cardSubtitle}>
                Get property value estimates from multiple sources
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            {/* Input Form */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MapPin color="#374151" size={16} />
                <Text style={styles.label}>Property Address</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="123 Main Street, City, State, ZIP"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputHint}>Enter any address to see sample market analysis</Text>
            </View>

            {/* Demo Alert */}
            <View style={styles.alert}>
              <Info color="#2563eb" size={16} />
              <View style={styles.alertContent}>
                <Text style={styles.alertText}>
                  <Text style={styles.alertBold}>Demo Mode:</Text> This is a mockup showing sample
                  data. In production, this would connect to real estate APIs like Zillow, Redfin,
                  MLS databases, and county records for authentic property valuations.
                </Text>
              </View>
            </View>

            {/* Analyze Button */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                (loading || !address.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleAnalyze}
              disabled={loading || !address.trim()}>
              {loading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>Analyzing Property...</Text>
                </>
              ) : (
                <>
                  <Search color="#fff" size={20} />
                  <Text style={styles.buttonText}>Generate Market Analysis</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  flex1: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  alert: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginBottom: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  alertBold: {
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  newAnalysisButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  newAnalysisButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  propertyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  detailColumn: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  averageCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  averageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  averageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  averageValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#14532d',
    marginBottom: 4,
  },
  averageSubtext: {
    fontSize: 14,
    color: '#16a34a',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  estimateCard: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  estimateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  estimateIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateInfo: {
    flex: 1,
  },
  estimateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  estimateSource: {
    fontSize: 16,
    fontWeight: '600',
  },
  estimateBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  estimateBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
  },
  estimateMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  estimateMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  estimateMetaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  estimateRight: {
    alignItems: 'flex-end',
  },
  estimateValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  estimateDiff: {
    fontSize: 13,
    color: '#6b7280',
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#9a3412',
    lineHeight: 20,
  },
  disclaimerBold: {
    fontWeight: '700',
  },
});
