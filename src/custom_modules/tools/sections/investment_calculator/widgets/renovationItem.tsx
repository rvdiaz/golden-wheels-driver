import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Home, Trash2, DollarSign, Plus, Minus } from 'lucide-react-native';
import ModalPickerComponent from '~/codidge_components/UI/modalSelector';
import { RENOVATION_CATEGORIES } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';

// Variation 1: Vertical Card Layout
const RenovationItemVertical = ({ field, index, control, onRemoveRenovationItem }: any) => (
  <View key={field.id} style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Item #{index + 1}</Text>
      <TouchableOpacity
        onPress={() => onRemoveRenovationItem(index)}
        style={styles.deleteIconButton}>
        <Trash2 size={18} color="#dc2626" />
      </TouchableOpacity>
    </View>

    <View style={styles.verticalInputs}>
      <Controller
        control={control}
        name={`renovationItems.${index}.category`}
        render={({ field: { onChange, value } }) => (
          <ModalPickerComponent
            data={RENOVATION_CATEGORIES.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="Select category"
            value={value || null}
            onChange={onChange}
            label="Category"
            search={true}
            icon={<Home size={16} color="#6b7280" />}
          />
        )}
      />

      <Controller
        control={control}
        name={`renovationItems.${index}.cost`}
        render={({ field: { onChange, value } }) => (
          <InputField
            allowCommas={true}
            label="Estimated Cost"
            placeholder="Enter amount"
            value={value?.toString() || ''}
            onChangeText={onChange}
            keyboardType="numeric"
            leftIcon={<DollarSign size={16} color="#6b7280" />}
          />
        )}
      />
    </View>
  </View>
);

// Variation 2: Horizontal Card with Better Spacing
const RenovationItemHorizontalCard = ({ field, index, control, onRemoveRenovationItem }: any) => (
  <View key={field.id} style={styles.horizontalCard}>
    <View style={styles.horizontalCardContent}>
      <View style={styles.inputColumn}>
        <Controller
          control={control}
          name={`renovationItems.${index}.category`}
          render={({ field: { onChange, value } }) => (
            <ModalPickerComponent
              data={RENOVATION_CATEGORIES.map((category) => ({
                label: category,
                value: category,
              }))}
              placeholder="Category"
              value={value || null}
              onChange={onChange}
              search={true}
              icon={<Home size={14} color="#6b7280" />}
            />
          )}
        />
      </View>

      <View style={styles.inputColumn}>
        <Controller
          control={control}
          name={`renovationItems.${index}.cost`}
          render={({ field: { onChange, value } }) => (
            <InputField
              placeholder="Cost"
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              keyboardType="numeric"
              leftIcon={<DollarSign size={14} color="#6b7280" />}
            />
          )}
        />
      </View>
    </View>

    <TouchableOpacity
      onPress={() => onRemoveRenovationItem(index)}
      style={styles.horizontalDeleteButton}>
      <Trash2 size={16} color="#dc2626" />
    </TouchableOpacity>
  </View>
);

// Variation 3: Expandable Row
const RenovationItemExpandable = ({ field, index, control, onRemoveRenovationItem }: any) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <View key={field.id} style={styles.expandableContainer}>
      <TouchableOpacity style={styles.expandableHeader} onPress={() => setExpanded(!expanded)}>
        <View style={styles.expandableHeaderLeft}>
          <Text style={styles.expandableTitle}>Renovation Item #{index + 1}</Text>
        </View>

        <View style={styles.expandableHeaderRight}>
          <TouchableOpacity
            onPress={() => onRemoveRenovationItem(index)}
            style={styles.expandableDeleteButton}>
            <Trash2 size={16} color="#dc2626" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            {expanded ? <Minus size={16} color="#6b7280" /> : <Plus size={16} color="#6b7280" />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandableContent}>
          <Controller
            control={control}
            name={`renovationItems.${index}.category`}
            render={({ field: { onChange, value } }) => (
              <ModalPickerComponent
                data={RENOVATION_CATEGORIES.map((category) => ({
                  label: category,
                  value: category,
                }))}
                placeholder="Select category"
                value={value || null}
                onChange={onChange}
                label="Category"
                search={true}
                icon={<Home size={16} color="#6b7280" />}
              />
            )}
          />

          <Controller
            control={control}
            name={`renovationItems.${index}.cost`}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Estimated Cost ($)"
                placeholder="Enter amount"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
                leftIcon={<DollarSign size={16} color="#6b7280" />}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

// Variation 4: Compact List Item
const RenovationItemCompact = ({ field, index, control, onRemoveRenovationItem }: any) => (
  <View key={field.id} style={styles.compactItem}>
    <View style={styles.compactNumber}>
      <Text style={styles.compactNumberText}>{index + 1}</Text>
    </View>

    <View style={styles.compactContent}>
      <Controller
        control={control}
        name={`renovationItems.${index}.category`}
        render={({ field: { onChange, value } }) => (
          <View style={styles.compactInput}>
            <ModalPickerComponent
              data={RENOVATION_CATEGORIES.map((category) => ({
                label: category,
                value: category,
              }))}
              placeholder="Category"
              value={value || null}
              onChange={onChange}
              search={true}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name={`renovationItems.${index}.cost`}
        render={({ field: { onChange, value } }) => (
          <View style={styles.compactInput}>
            <InputField
              placeholder="$0"
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        )}
      />
    </View>

    <TouchableOpacity
      onPress={() => onRemoveRenovationItem(index)}
      style={styles.compactDeleteButton}>
      <Trash2 size={16} color="#dc2626" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  // Variation 1: Vertical Card
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  deleteIconButton: {
    padding: 4,
  },
  verticalInputs: {
    gap: 16,
  },

  // Variation 2: Horizontal Card
  horizontalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalCardContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  inputColumn: {
    flex: 1,
  },
  horizontalDeleteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },

  // Variation 3: Expandable
  expandableContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expandableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  expandableHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandableDeleteButton: {
    padding: 4,
  },
  expandableContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  // Variation 4: Compact
  compactItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  compactNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  compactInput: {
    flex: 1,
  },
  compactDeleteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
});

export {
  RenovationItemVertical,
  RenovationItemHorizontalCard,
  RenovationItemExpandable,
  RenovationItemCompact,
};
