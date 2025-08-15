import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';

interface ExpiredSearchData {
  zipCode: string;
  daysExpired: number;
}

interface ExpiredListing {
  id: string;
  address: string;
  price: string;
  daysOnMarket: number;
  expiredDate: string;
  agent: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: string;
  listingType: string;
}

export const ExpiredListingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [listings, setListings] = useState<ExpiredListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpiredSearchData>({});

  const searchExpiredListings = async (data: ExpiredSearchData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock expired listings data
      const mockListings: ExpiredListing[] = [
        {
          id: '1',
          address: '123 Oak Street, Springfield, IL 62701',
          price: '$285,000',
          daysOnMarket: 127,
          expiredDate: '2024-02-15',
          agent: 'Sarah Johnson - Century 21',
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: '1,850',
          listingType: 'Single Family',
        },
        {
          id: '2',
          address: '456 Maple Ave, Springfield, IL 62702',
          price: '$320,000',
          daysOnMarket: 89,
          expiredDate: '2024-02-20',
          agent: 'Mike Brown - RE/MAX',
          bedrooms: 4,
          bathrooms: 3,
          squareFeet: '2,200',
          listingType: 'Single Family',
        },
        {
          id: '3',
          address: '789 Pine Road, Springfield, IL 62703',
          price: '$195,000',
          daysOnMarket: 156,
          expiredDate: '2024-02-10',
          agent: 'Lisa Davis - Keller Williams',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: '1,200',
          listingType: 'Condo',
        },
        {
          id: '4',
          address: '321 Elm Street, Springfield, IL 62704',
          price: '$450,000',
          daysOnMarket: 203,
          expiredDate: '2024-01-28',
          agent: 'Tom Wilson - Coldwell Banker',
          bedrooms: 5,
          bathrooms: 4,
          squareFeet: '3,100',
          listingType: 'Single Family',
        },
      ];

      setListings(mockListings);
      setIsLoading(false);
    }, 2000);
  };

  const renderListing = ({ item }: { item: ExpiredListing }) => (
    <Card style={styles.listingCard}>
      <View style={styles.listingHeader}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>EXPIRED</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icons.Heart size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.address}>{item.address}</Text>

      <View style={styles.propertyDetails}>
        <View style={styles.detailItem}>
          <Icons.Bed size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.bedrooms} BR</Text>
        </View>
        <View style={styles.detailItem}>
          <Icons.Bath size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.bathrooms} BA</Text>
        </View>
        <View style={styles.detailItem}>
          <Icons.Square size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.squareFeet} sq ft</Text>
        </View>
      </View>

      <View style={styles.listingMeta}>
        <View style={styles.metaItem}>
          <Icons.Calendar size={14} color="#6B7280" />
          <Text style={styles.metaText}>Expired: {item.expiredDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icons.Clock size={14} color="#6B7280" />
          <Text style={styles.metaText}>{item.daysOnMarket} days on market</Text>
        </View>
      </View>

      <Text style={styles.agentInfo}>Listed by: {item.agent}</Text>

      <View style={styles.listingActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icons.Phone size={16} color="#2563EB" />
          <Text style={styles.actionText}>Contact Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icons.Mail size={16} color="#2563EB" />
          <Text style={styles.actionText}>Send Letter</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Find Expired Listing"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.content}>
        <Card style={styles.searchCard}>
          <Text style={styles.cardTitle}>Find Expired Listings</Text>
          <Text style={styles.cardSubtitle}>Search for expired listings in your target area</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>ZIP Code</Text>
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

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Days Expired</Text>
              <Controller
                control={control}
                name="daysExpired"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.daysExpired && styles.inputError]}
                    placeholder="30"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.daysExpired && (
                <Text style={styles.errorText}>{errors.daysExpired.message}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
            onPress={handleSubmit(searchExpiredListings)}
            disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.searchButtonText}>Searching...</Text>
            ) : (
              <>
                <Icons.Search size={20} color="white" />
                <Text style={styles.searchButtonText}>Search Listings</Text>
              </>
            )}
          </TouchableOpacity>
        </Card>

        {listings.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Found {listings.length} expired listings</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icons.Filter size={16} color="#6B7280" />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listingCard: {
    padding: 16,
    marginBottom: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  favoriteButton: {
    padding: 4,
  },
  address: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  propertyDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  listingMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  agentInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  listingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 4,
  },
});
