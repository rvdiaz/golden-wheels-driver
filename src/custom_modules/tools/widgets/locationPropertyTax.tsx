import { useLazyQuery } from '@apollo/client';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import { searchLocationsQueries } from '../api/queries';
import Constants from 'expo-constants';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface ISuggestionsApp {
  id: string;
  county: string;
  city: string;
  propertyTax: number;
}

const tenantId = Constants.expoConfig?.extra?.TENANTID;

const LocationAutocomplete = ({ onSelection }: { onSelection: (taxRate: number) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ISuggestionsApp | null>(null);
  const inputRef = useRef<TextInput>(null);

  const [getLocationsFn, { data, loading }] = useLazyQuery<{
    searchLocations: ISuggestionsApp[];
  }>(searchLocationsQueries);

  // Trigger search when user types
  useEffect(() => {
    const fetchSuggestions = async (filterToken: string) => {
      await getLocationsFn({
        variables: {
          tenant: {
            tenantId: tenantId,
          },
          state: 'Florida',
          input: filterToken,
        },
      });
    };

    if (searchTerm.trim().length > 1) {
      fetchSuggestions(searchTerm);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, getLocationsFn]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    // Clear selection if user is typing something different
    if (selectedLocation && value !== `${selectedLocation.city}, ${selectedLocation.county}`) {
      setSelectedLocation(null);
    }
  };

  const handleLocationSelect = (location: ISuggestionsApp) => {
    onSelection(location.propertyTax);
    setSelectedLocation(location);
    setSearchTerm(`${location.city}, ${location.county}`);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const suggestions = data?.searchLocations || [];

  const renderSuggestionItem = ({ item }: { item: ISuggestionsApp }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSelect(item)}
      activeOpacity={0.7}>
      <View style={styles.suggestionContent}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityText}>{item.city}</Text>
          <Text style={styles.countyText}>{item.county} County</Text>
        </View>
        <View style={styles.taxBadge}>
          <Text style={styles.taxText}>{item.propertyTax}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (searchTerm.trim().length > 1 && suggestions.length === 0 && !selectedLocation) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No locations found for "{searchTerm}"</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Input Field */}
      <View style={styles.inputContainer}>
        <InputField
          label="County, City (Optional)"
          ref={inputRef}
          value={searchTerm}
          onChangeText={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 && searchTerm.trim().length > 1) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for a city or county..."
          autoCapitalize="words"
          autoCorrect={false}
          clearable
        />
      </View>

      {/* Dropdown */}
      {isOpen &&
        (suggestions.length > 0 ? (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {suggestions.map((item, index) => (
                <View key={`${item.id} ${index}`}>{renderSuggestionItem({ item })}</View>
              ))}
            </ScrollView>
          </View>
        ) : (
          renderEmptyState()
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1000,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  countyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  taxBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taxText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});

export default LocationAutocomplete;
