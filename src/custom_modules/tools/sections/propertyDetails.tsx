import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import * as Icons from 'lucide-react-native';
import { Header } from '~/components/Header';
import { Card } from '~/components/Card';

interface PropertySearchData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const PropertyInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertySearchData>({});

  const searchProperty = async (data: PropertySearchData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock property data
      const mockData = {
        address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
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

      setPropertyData(mockData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Property Information" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.searchCard}>
          <Text style={styles.cardTitle}>Property Lookup</Text>
          <Text style={styles.cardSubtitle}>
            Enter the property address to get owner and property information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.address && styles.inputError]}
                  placeholder="123 Main Street"
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>City</Text>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.city && styles.inputError]}
                    placeholder="Springfield"
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}>
              <Text style={styles.inputLabel}>State</Text>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.state && styles.inputError]}
                    placeholder="IL"
                    value={value || ''}
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    maxLength={2}
                  />
                )}
              />
              {errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>ZIP</Text>
              <Controller
                control={control}
                name="zipCode"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.zipCode && styles.inputError]}
                    placeholder="62701"
                    value={value || ''}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode.message}</Text>}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
            onPress={handleSubmit(searchProperty)}
            disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.searchButtonText}>Searching...</Text>
            ) : (
              <>
                <Icons.Search size={20} color="white" />
                <Text style={styles.searchButtonText}>Search Property</Text>
              </>
            )}
          </TouchableOpacity>
        </Card>

        {propertyData && (
          <>
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Icons.Home size={24} color="#2563EB" />
                <Text style={styles.resultTitle}>Property Details</Text>
              </View>
              <Text style={styles.propertyAddress}>{propertyData.address}</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year Built:</Text>
                <Text style={styles.detailValue}>{propertyData.property.yearBuilt}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Square Feet:</Text>
                <Text style={styles.detailValue}>{propertyData.property.squareFeet}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bedrooms/Bathrooms:</Text>
                <Text style={styles.detailValue}>
                  {propertyData.property.bedrooms}BR / {propertyData.property.bathrooms}BA
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lot Size:</Text>
                <Text style={styles.detailValue}>{propertyData.property.lotSize}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Property Type:</Text>
                <Text style={styles.detailValue}>{propertyData.property.propertyType}</Text>
              </View>
            </Card>

            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Icons.User size={24} color="#10B981" />
                <Text style={styles.resultTitle}>Owner Information</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Owner Name:</Text>
                <Text style={styles.detailValue}>{propertyData.owner.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mailing Address:</Text>
                <Text style={styles.detailValue}>{propertyData.owner.mailingAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{propertyData.owner.phone}</Text>
              </View>
            </Card>

            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Icons.DollarSign size={24} color="#F59E0B" />
                <Text style={styles.resultTitle}>Financial Information</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assessed Value:</Text>
                <Text style={styles.detailValue}>{propertyData.property.assessedValue}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Market Value:</Text>
                <Text style={styles.detailValue}>{propertyData.property.marketValue}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Sale:</Text>
                <Text style={styles.detailValue}>
                  {propertyData.property.lastSalePrice} ({propertyData.property.lastSaleDate})
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Annual Tax:</Text>
                <Text style={styles.detailValue}>{propertyData.tax.annualTax}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mortgage Lender:</Text>
                <Text style={styles.detailValue}>{propertyData.mortgage.lender}</Text>
              </View>
            </Card>

            <Card style={styles.actionCard}>
              <TouchableOpacity style={styles.actionButton}>
                <Icons.Phone size={20} color="white" />
                <Text style={styles.actionButtonText}>Call Owner</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Icons.Mail size={20} color="#2563EB" />
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  Send Letter
                </Text>
              </TouchableOpacity>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  searchButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    padding: 20,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  actionCard: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2563EB',
  },
});
