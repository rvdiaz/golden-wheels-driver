import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';

interface DropdownItem {
  label: string;
  value: string;
}

interface ModalPickerProps {
  data: DropdownItem[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  search?: boolean;
  label?: string;
  required?: boolean;
  icon?: React.ReactElement;
}

const ModalPickerComponent: React.FC<ModalPickerProps> = ({
  data,
  placeholder = 'Select item',
  value,
  onChange,
  error,
  errorMessage,
  search = false,
  label,
  required,
  icon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Find the selected item to display its label
  const selectedItem = data.find((item) => item.value === value);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  // Filter data based on search text
  const filteredData = search
    ? data.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase()))
    : data;

  const handleItemSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setModalVisible(false);
    setSearchText(''); // Reset search when closing
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSearchText(''); // Reset search when closing
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => handleItemSelect(item.value)}>
      <Text style={styles.modalItemText}>{item.label}</Text>
      {item.value === value && <AntDesign name="check" size={16} color="#007AFF" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.labelStyle}>
          {label} {required && <Text style={{ color: 'red' }}> *</Text>}
        </Text>
      )}

      {/* Input-like touchable area */}
      <TouchableOpacity
        style={[styles.input, error ? styles.errorBorder : null]}
        onPress={() => setModalVisible(true)}>
        <View style={styles.inputContent}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.inputText, !selectedItem && styles.placeholderText]}>
            {displayText}
          </Text>
          <ChevronDown size={18} color="#666" />
        </View>
      </TouchableOpacity>

      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Search input */}
          {search && (
            <View style={styles.searchContainer}>
              <AntDesign size={16} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <AntDesign name="close" size={16} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* List */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Empty state */}
          {filteredData.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {search && searchText ? 'No results found' : 'No options available'}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ModalPickerComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    height: 48,
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#ccc',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#EF4444',
  },
  labelStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '400',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 60, // To balance the cancel button
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  list: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
