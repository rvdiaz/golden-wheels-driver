import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TextInput,
} from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { getSearchAutoCompleteQuery } from '../api/queries';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface ISuggestionsApp {
  displayName: string;
  address: string;
  placeId: string;
  meta: any;
}

interface ISearchResults {
  places: ISuggestionsApp[];
}

interface Props {
  onSelection: (address: string) => void;
}

const SearchAddressAutoComplete: React.FC<Props> = ({ onSelection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ISuggestionsApp | null>(null);
  const inputRef = useRef<TextInput>(null);

  const [getSearchFn, { data, loading }] = useLazyQuery<{ autoCompleteSearch: ISearchResults }>(
    getSearchAutoCompleteQuery
  );
  const suggestions = data?.autoCompleteSearch?.places || [];
  const [skipFetch, setSkipFetch] = useState(false);
  /** Fetch suggestions when user types */
  useEffect(() => {
    if (skipFetch) return; // ✅ Stop fetching if user selected an item

    const handler = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        getSearchFn({ variables: { input: searchTerm } });
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, getSearchFn, skipFetch]);

  /** Handle input change */
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setSkipFetch(false); // ✅ Allow search again
      if (selectedLocation && value !== selectedLocation.address) {
        setSelectedLocation(null);
      }
    },
    [selectedLocation]
  );
  /** Handle location selection */
  const handleLocationSelect = useCallback(
    (location: ISuggestionsApp) => {
      onSelection(location.placeId);
      setSearchTerm(location.displayName);
      setSelectedLocation(location);
      setIsOpen(false);
      setSkipFetch(true); // ✅ Disable search
      Keyboard.dismiss();
    },
    [onSelection]
  );

  /** Suggestion Item */
  const SuggestionItem = ({ item }: { item: ISuggestionsApp }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        handleLocationSelect(item);
      }}
      activeOpacity={0.7}>
      <Text style={styles.countyText}>{item.address}</Text>
    </TouchableOpacity>
  );

  /** Empty State */
  const EmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label="Full Address"
          labelStyle={{
            marginBottom: 18,
          }}
          ref={inputRef}
          value={searchTerm}
          onChangeText={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 && searchTerm.trim().length > 1) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for a full address"
          autoCapitalize="words"
          autoCorrect={false}
          clearable
        />
      </View>

      {isOpen &&
        (suggestions.length > 0 ? (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {suggestions.map((item) => (
                <SuggestionItem key={item.placeId} item={item} />
              ))}
            </ScrollView>
          </View>
        ) : (
          <EmptyState />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    overflow: 'visible',
  },
  inputContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100000,
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
  countyText: {
    fontSize: 14,
    color: '#6B7280',
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

export default SearchAddressAutoComplete;
