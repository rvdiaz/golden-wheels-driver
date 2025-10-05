import { useReactiveVar } from '@apollo/client';
import React, { useState, useRef } from 'react';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { crmSearhInput, selectedFiltersVar, selectedSortVar } from '../hooks/tabSelectionVar';
import * as Icons from 'lucide-react-native';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { theme } from '~/theme/theme';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { ContactCategory } from '../interfaces';
import Text from '~/codidge_components/UI/text';

// Get screen dimensions
const { height: screenHeight } = Dimensions.get('window');

// Type definitions
interface FilterOption {
  id: ContactCategory;
  label: string;
  icon: keyof typeof Icons;
}

interface SortOption {
  id: string;
  label: string;
  icon: keyof typeof Icons;
}

interface ButtonLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SearchCrmBoxIA = () => {
  const searchInputValue = useReactiveVar(crmSearhInput);
  const selectedFilters = useReactiveVar(selectedFiltersVar);
  const selectedSort = useReactiveVar(selectedSortVar);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sort' | 'filter'>('sort');
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);
  const [buttonLayout, setButtonLayout] = useState<ButtonLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Filter options based on ContactCategory enum
  const filterOptions: FilterOption[] = [
    { id: ContactCategory.AGENT, label: 'Agent', icon: 'UserCheck' },
    { id: ContactCategory.BUYER, label: 'Buyer', icon: 'ShoppingCart' },
    { id: ContactCategory.SELLER, label: 'Seller', icon: 'Home' },
    { id: ContactCategory.RENTER, label: 'Renter', icon: 'Key' },
    { id: ContactCategory.LANDLORD, label: 'Landlord', icon: 'Building' },
    { id: ContactCategory.FSBO, label: 'FSBO', icon: 'FileText' },
    { id: ContactCategory.FRBO, label: 'FRBO', icon: 'FileCheck' },
    { id: ContactCategory.EXPIRED, label: 'Expired', icon: 'Clock' },
    { id: ContactCategory.INVESTOR, label: 'Investor', icon: 'TrendingUp' },
  ];

  const sortOptions: SortOption[] = [
    { id: 'name_asc', label: 'Name (A-Z)', icon: 'ArrowUpAZ' },
    { id: 'name_desc', label: 'Name (Z-A)', icon: 'ArrowDownAZ' },
    { id: 'date_newest', label: 'Newest First', icon: 'ArrowUp' },
    { id: 'date_oldest', label: 'Oldest First', icon: 'ArrowDown' },
  ];

  const handleFilterPress = (): void => {
    if (buttonRef.current) {
      buttonRef.current.measure(
        (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          setButtonLayout({ x: pageX, y: pageY, width, height });
          setShowDropdown(true);
        }
      );
    }
  };

  const toggleFilter = (filterId: ContactCategory): void => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    selectedFiltersVar(newFilters);
  };

  const selectSort = (sortId: string): void => {
    selectedSortVar(sortId === selectedSort ? null : sortId);
  };

  const clearAll = (): void => {
    selectedFiltersVar(new Set());
    selectedSortVar(null);
  };

  const getTotalActiveFilters = (): number => {
    return selectedFilters.size + (selectedSort ? 1 : 0);
  };

  const renderIcon = (
    iconName: keyof typeof Icons,
    size: number = 16,
    color: string = '#fff'
  ): React.ReactNode => {
    const IconComponent = Icons[iconName] as React.ComponentType<{
      size?: number;
      color?: string;
    }>;
    return IconComponent ? <IconComponent size={size} color={color} /> : null;
  };

  const calculateDropdownPosition = () => {
    const dropdownHeight = 400; // Approximate max height
    const spaceBelow = screenHeight - buttonLayout.y - buttonLayout.height;
    const spaceAbove = buttonLayout.y;

    // If there's not enough space below, show above
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      return {
        bottom: screenHeight - buttonLayout.y + 8,
        maxHeight: Math.min(spaceAbove - 20, 350),
      };
    } else {
      return {
        top: buttonLayout.y + buttonLayout.height + 8,
        maxHeight: Math.min(spaceBelow - 20, 350),
      };
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'sort') {
      return (
        <View style={styles.tabContent}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionItem, selectedSort === option.id && styles.selectedOption]}
              onPress={() => selectSort(option.id)}>
              <View style={styles.optionContent}>
                {renderIcon(
                  option.icon,
                  16,
                  selectedSort === option.id ? theme.colors.primary : '#666'
                )}
                <Text
                  style={[styles.optionText, selectedSort === option.id && styles.selectedText]}>
                  {option.label}
                </Text>
              </View>
              {selectedSort === option.id && renderIcon('Check', 16, theme.colors.primary)}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContent}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionItem, selectedFilters.has(option.id) && styles.selectedOption]}
              onPress={() => toggleFilter(option.id)}>
              <View style={styles.optionContent}>
                {renderIcon(
                  option.icon,
                  16,
                  selectedFilters.has(option.id) ? theme.colors.primary : '#666'
                )}
                <Text
                  style={[
                    styles.optionText,
                    selectedFilters.has(option.id) && styles.selectedText,
                  ]}>
                  {option.label}
                </Text>
              </View>
              {selectedFilters.has(option.id) && renderIcon('Check', 16, theme.colors.primary)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderDropdown = (): React.ReactNode => {
    const position = calculateDropdownPosition();

    return (
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  {
                    right: 16,
                    width: 280,
                    ...position,
                  },
                ]}>
                {/* Header with tabs */}
                <View style={styles.dropdownHeader}>
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'sort' && styles.activeTab]}
                      onPress={() => setActiveTab('sort')}>
                      <Text style={[styles.tabText, activeTab === 'sort' && styles.activeTabText]}>
                        Sort {selectedSort && '(1)'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'filter' && styles.activeTab]}
                      onPress={() => setActiveTab('filter')}>
                      <Text
                        style={[styles.tabText, activeTab === 'filter' && styles.activeTabText]}>
                        Filter {selectedFilters.size > 0 && `(${selectedFilters.size})`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {getTotalActiveFilters() > 0 && (
                    <TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
                      <Text style={styles.clearButton}>Clear All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Tab Content */}
                {renderTabContent()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <InputField
          value={searchInputValue}
          onChangeText={(e: string) => {
            crmSearhInput(e);
          }}
          placeholder="Search Contacts"
          placeholderTextColor="#fff"
          leftIcon={<Icons.Search size={16} color="#fff" />}
          style={{
            borderWidth: 0,
            backgroundColor: theme.colors.menuItemActive,
            color: '#fff',
            marginBottom: 0,
          }}
        />
      </View>

      <View style={styles.filterButtonContainer}>
        <IconButton
          ref={buttonRef}
          onPress={handleFilterPress}
          style={styles.buttonStyles}
          icon={<Icons.ListFilter color="#fff" size={16} />}
        />
        {getTotalActiveFilters() > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getTotalActiveFilters()}</Text>
          </View>
        )}
      </View>

      {renderDropdown()}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
  },
  filterButtonContainer: {
    position: 'relative',
  },
  buttonStyles: {
    backgroundColor: theme.colors.menuItemActive,
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButton: {
    fontSize: 12,
    color: theme.colors.primary || '#007AFF',
    fontWeight: '500',
  },
  tabContent: {
    paddingVertical: 8,
  },
  scrollableContent: {
    maxHeight: 550,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 1,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary ? `${theme.colors.primary}15` : '#007AFF15',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  selectedText: {
    color: theme.colors.primary || '#007AFF',
    fontWeight: '500',
  },
});
