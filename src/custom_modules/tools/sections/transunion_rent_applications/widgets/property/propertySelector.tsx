import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getTransunionPropertyQuery } from '~/custom_modules/tools/api/queries';
import { ITransUnionProperty } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { Search, ChevronDown } from 'lucide-react-native';
import { PropertyForm } from './propertyForm';
import { Header } from '~/codidge_components/UI/header';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { PropertyItem } from './propertyItem';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';

// Property Selector Widget Component
interface PropertySelectorWidgetProps {
  selectedProperty?: ITransUnionProperty | null;
  onPropertySelect: (property: ITransUnionProperty) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const PropertySelectorWidget: React.FC<PropertySelectorWidgetProps> = ({
  selectedProperty,
  onPropertySelect,
  placeholder = 'Select a property',
  label = 'Property',
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePropertySelect = (property: ITransUnionProperty) => {
    onPropertySelect(property);
    setModalVisible(false);
  };

  const formatSelectedPropertyDisplay = (property: ITransUnionProperty) => {
    const addressParts = [property.addressLine1, property.locality, property.region].filter(
      Boolean
    );

    return addressParts.join(', ') || 'Unnamed Property';
  };

  return (
    <View style={styles.widgetContainer}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          {label && <Text style={styles.widgetLabel}>{label}</Text>}
          {selectedProperty && (
            <TextButton
              textStyle={{
                color: theme.colors.info,
              }}
              size={ButtonSize.LARGE}
              title="Change"
              onPress={() => !disabled && setModalVisible(true)}
            />
          )}
        </View>
        {selectedProperty ? (
          <PropertyItem
            item={selectedProperty}
            refetch={() => {}}
            containerStyle={{
              borderWidth: 1,
              borderColor: theme.colors.borderNeutralColor,
            }}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.selectorButton,
              error && styles.selectorButtonError,
              disabled && styles.selectorButtonDisabled,
            ]}
            onPress={() => !disabled && setModalVisible(true)}
            disabled={disabled}>
            <View style={styles.selectorContent}>
              <Icons.Home size={18} color="#737373" />
              <Text
                style={[
                  styles.selectorText,
                  !selectedProperty && styles.selectorPlaceholder,
                  disabled && styles.selectorTextDisabled,
                ]}
                numberOfLines={1}>
                {selectedProperty ? formatSelectedPropertyDisplay(selectedProperty) : placeholder}
              </Text>
              <ChevronDown size={20} color={disabled ? '#ccc' : '#666'} />
            </View>
          </TouchableOpacity>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <PropertySelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPropertySelect={handlePropertySelect}
        selectedPropertyId={selectedProperty?.propertyId}
      />
    </View>
  );
};

// Property Selector Modal Component
interface PropertySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onPropertySelect: (property: ITransUnionProperty) => void;
  selectedPropertyId?: string;
}

export const PropertySelectorModal: React.FC<PropertySelectorModalProps> = ({
  visible,
  onClose,
  onPropertySelect,
  selectedPropertyId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const user = useReactiveVar(userData);

  const { data, loading, error, refetch } = useQuery(getTransunionPropertyQuery, {
    variables: { userId: user?.id },
    errorPolicy: 'all',
    skip: !visible,
    onError: (error) => {
      Alert.alert('Error', 'Failed to load properties. Please try again.');
      console.error('GraphQL Error:', error);
    },
  });

  const activesProperties = data?.getTransunionProperties.filter((prop: any) => prop.isActive);

  // Filter properties based on search term
  const filteredProperties = useMemo(() => {
    if (!activesProperties) return [];

    const properties = Array.isArray(activesProperties) ? activesProperties : [activesProperties];

    if (!searchTerm.trim()) return properties;

    return properties.filter((property: ITransUnionProperty) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.addressLine1?.toLowerCase().includes(searchLower) ||
        property.locality?.toLowerCase().includes(searchLower) ||
        property.region?.toLowerCase().includes(searchLower) ||
        property.postalCode?.toLowerCase().includes(searchLower)
      );
    });
  }, [activesProperties, searchTerm]);

  const formatAddress = (property: ITransUnionProperty) => {
    const addressParts = [
      property.addressLine1,
      property.addressLine2,
      property.addressLine3,
      property.addressLine4,
    ].filter(Boolean);

    const primaryAddress = addressParts.join(', ');
    const secondaryAddress = [property.locality, property.region, property.postalCode]
      .filter(Boolean)
      .join(', ');

    return { primaryAddress, secondaryAddress };
  };

  const renderSelectablePropertyItem = ({ item }: { item: ITransUnionProperty }) => {
    const { primaryAddress, secondaryAddress } = formatAddress(item);
    const isSelected = item.propertyId === selectedPropertyId;

    return (
      <TouchableOpacity
        style={[styles.selectablePropertyCard, isSelected && styles.selectedPropertyCard]}
        onPress={() => onPropertySelect(item)}
        activeOpacity={0.7}>
        {/* Selection Indicator */}
        <View style={styles.selectionIndicator}>
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        </View>

        {/* Property Content */}
        <View style={styles.selectablePropertyContent}>
          {/* Address Section */}
          <View style={styles.selectableAddressSection}>
            <Text style={styles.selectablePrimaryAddress} numberOfLines={1}>
              {primaryAddress || 'Address not available'}
            </Text>
            {secondaryAddress && (
              <Text style={styles.selectableSecondaryAddress} numberOfLines={1}>
                {secondaryAddress}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🏠</Text>
      <Text style={styles.emptyStateTitle}>
        {searchTerm ? 'No properties found' : 'No properties available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchTerm ? `No properties match "${searchTerm}"` : 'Add a new property to get started'}
      </Text>
    </View>
  );

  const handleAddProperty = () => {
    refetch();
    setShowPropertyForm(false);
  };

  const resetModal = () => {
    setSearchTerm('');
    setShowPropertyForm(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
      <PageSafeContainer style={styles.modalOverlay}>
        <Header
          title="Select Property"
          showBack={true}
          onBack={handleClose}
          //rightAction={handleSubmit(onSubmit)}
          rightText="Save"
          loadingRight={loading}
          //disabledRight={!isValid}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPropertyForm}
          onRequestClose={() => {
            setShowPropertyForm(false);
          }}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <PropertyForm
              disposeModalHandler={() => {
                setShowPropertyForm(false);
              }}
              onAddProperty={() => {
                refetch();
              }}
            />
          </View>
        </Modal>

        <>
          {/* Search Section */}
          <View style={styles.searchContainer}>
            <InputField
              placeholder="Search properties by name or address"
              value={searchTerm}
              onChangeText={setSearchTerm}
              leftIcon={<Search size={16} />}
              label=""
            />
          </View>

          {/* Add New Property Button */}
          <View style={styles.addButtonContainer}>
            <OutlineButton
              title="Add Property"
              size={ButtonSize.LARGE}
              leftWidget={
                <Icons.Plus
                  color={theme.colors.primary}
                  size={18}
                  onPress={() => setShowPropertyForm(true)}
                />
              }
              onPress={() => {
                setShowPropertyForm(true);
              }}
            />
          </View>

          {/* Properties List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : error && !data ? (
            <View style={styles.errorState}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Unable to load properties</Text>
              <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProperties}
              renderItem={renderSelectablePropertyItem}
              keyExtractor={(item, index) => item.propertyId || `property-${index}`}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </>
      </PageSafeContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Widget Styles
  widgetContainer: {
    margin: 16,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  widgetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  selectorButtonError: {
    borderColor: '#dc3545',
  },
  selectorButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectorPlaceholder: {
    color: '#999',
  },
  selectorTextDisabled: {
    color: '#ccc',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  formContainer: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  selectablePropertyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.borderNeutralColor,
    alignItems: 'flex-start',
  },
  selectedPropertyCard: {
    borderColor: theme.colors.primary,
  },
  selectionIndicator: {
    marginRight: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  selectablePropertyContent: {
    flex: 1,
  },
  propertyHeader: {
    marginBottom: 8,
  },

  selectablePropertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  selectableAddressSection: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectablePrimaryAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  selectableSecondaryAddress: {
    fontSize: 14,
    color: '#737373',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
