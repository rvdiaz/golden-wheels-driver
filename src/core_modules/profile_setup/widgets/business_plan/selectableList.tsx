// SelectableItemsList.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';
import { Check, Users } from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { iconMap, SwottItem } from '~/system_setting/interfaces';
import Text from '~/codidge_components/UI/text';

interface SelectableItemsListProps {
  items: SwottItem[];
  fieldName: string;
  title?: string;
  maxSelections?: number;
}

export const SelectableItemsList: React.FC<SelectableItemsListProps> = ({
  items,
  fieldName,
  title = '',
  maxSelections,
}) => {
  const { control } = useFormContext();

  const { field } = useController({
    control,
    name: fieldName,
    defaultValue: [],
  });

  const selectedItems: string[] = field.value || [];

  const handleItemToggle = (itemId: string) => {
    const isSelected = selectedItems.includes(itemId);

    if (isSelected) {
      // Remove item
      const newSelection = selectedItems.filter((id) => id !== itemId);
      field.onChange(newSelection);
    } else {
      // Add item (check max selections)
      if (maxSelections && selectedItems.length >= maxSelections) {
        return; // Don't add if max reached
      }
      const newSelection = [...selectedItems, itemId];
      field.onChange(newSelection);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const IconComponent = iconMap[item.icon] ?? Users; // fallback if missing
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemContainer, isSelected && styles.itemContainerSelected]}
              onPress={() => handleItemToggle(item.id)}
              activeOpacity={0.7}>
              <View style={styles.leftSection}>
                <IconComponent size={20} color={isSelected ? theme.colors.primary : '#6B7280'} />
              </View>
              <View style={styles.middleSection}>
                <Text style={[styles.itemLabel, isSelected && styles.itemLabelSelected]}>
                  {item.label}
                </Text>
              </View>

              <View style={styles.rightSection}>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Check size={16} color="#FFFFFF" />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {maxSelections && (
        <Text style={styles.selectionCounter}>
          {selectedItems.length} of {maxSelections} selected
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContainerSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.primary,
    borderWidth: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    marginRight: 12,
  },
  middleSection: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  itemLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  rightSection: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  selectionCounter: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
});
