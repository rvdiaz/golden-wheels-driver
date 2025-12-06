import { useLazyQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';
import { searchLocationsQueries } from '../api/queries';
import Constants from 'expo-constants';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

interface ISuggestionsApp {
  id: string;
  county: string;
  city: string;
  propertyTax: number;
}

interface LocationAutocompleteProps {
  onSelection: (taxRate: number) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const tenantId = Constants.expoConfig?.extra?.TENANTID;

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onSelection,
  label = 'County/City (Optional for accuracy)',
  placeholder = 'Search for a city or county...',
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  style,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ISuggestionsApp | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const [getLocationsFn, { data, loading }] = useLazyQuery<{
    searchLocations: ISuggestionsApp[];
  }>(searchLocationsQueries);

  // Trigger search when modal search query changes
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

    if (modalSearchQuery.trim().length > 1) {
      fetchSuggestions(modalSearchQuery);
    }
  }, [modalSearchQuery, getLocationsFn]);

  const handleOpenModal = () => {
    if (!disabled) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalSearchQuery('');
  };

  const handleLocationSelect = (location: ISuggestionsApp) => {
    onSelection(location.propertyTax);
    setSelectedLocation(location);
    setSearchTerm(`${location.city}, ${location.county}`);
    handleCloseModal();
  };

  const handleClearSelection = () => {
    setSearchTerm('');
    setSelectedLocation(null);
    onSelection(0); // Reset tax rate
  };

  const suggestions = data?.searchLocations || [];

  const renderLocationItem = ({ item }: { item: ISuggestionsApp }) => (
    <TouchableOpacity
      style={[styles.locationItem, selectedLocation?.id === item.id && styles.locationItemSelected]}
      onPress={() => handleLocationSelect(item)}>
      <View style={styles.locationContent}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityText}>{item.city}</Text>
          <Text style={styles.countyText}>{item.county} County</Text>
        </View>
        <View style={styles.taxBadge}>
          <Text style={styles.taxText}>{item.propertyTax}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.emptyText}>Searching locations...</Text>
        </View>
      );
    }

    if (modalSearchQuery.trim().length > 1 && suggestions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No locations found for "{modalSearchQuery}"</Text>
          <Text style={styles.emptySubtext}>Try searching for a different city or county</Text>
        </View>
      );
    }

    if (modalSearchQuery.trim().length <= 1) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start typing to search</Text>
          <Text style={styles.emptySubtext}>Enter at least 2 characters</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        onPress={handleOpenModal}
        disabled={disabled}
        activeOpacity={0.7}>
        <Text style={[styles.inputText, !searchTerm && styles.placeholderText]}>
          {searchTerm || placeholder}
        </Text>

        <View style={styles.rightActions}>
          {searchTerm && !disabled ? (
            <TouchableOpacity
              onPress={handleClearSelection}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.arrow}>▼</Text>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedInfoText}>
            Property Tax Rate:{' '}
            <Text style={styles.selectedInfoValue}>{selectedLocation.propertyTax}%</Text>
          </Text>
        </View>
      )}

      {/* Location Picker Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <InputField
              style={styles.searchInput}
              value={modalSearchQuery}
              onChangeText={setModalSearchQuery}
              placeholder="Search city or county..."
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={true}
            />

            {/* Results List */}
            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderLocationItem}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    minHeight: 48,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: theme.colors.errorText,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 10,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#EF4444',
  },
  selectedInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  selectedInfoText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedInfoValue: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '80%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6B7280',
  },
  searchInput: {
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  locationItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  locationContent: {
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
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  taxText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LocationAutocomplete;
