// components/forms/PropertyForm.tsx
import React from 'react';
import { Controller, UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFormatters } from '../custom_hooks';
import { Card } from '~/codidge_components/UI/card';
import { Home, Plus } from 'lucide-react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import OutlineButton, { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { RenovationItemExpandable } from './renovationItem';

interface PropertyFormProps {
  form: UseFormReturn<any>;
  renovationFieldArray: UseFieldArrayReturn<any, 'renovationItems'>;
  totalRenovationCost: number;
  totalRepairCosts: number;
  onUpdateUnitsCount: (count: number) => void;
  onAddRenovationItem: () => void;
  onRemoveRenovationItem: (index: number) => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  form,
  renovationFieldArray,
  totalRenovationCost,
  onUpdateUnitsCount,
  onAddRenovationItem,
  onRemoveRenovationItem,
}) => {
  const { formatCurrency } = useFormatters();
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchedPropertyValue = watch('propertyValue');
  const watchedDownPayment = watch('downPayment');
  const watchedNumberOfUnits = watch('numberOfUnits');

  const handlePropertyValueChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue('propertyValue', numValue);

    // Auto-calculate closing costs at 3% of property value
    const calculatedClosingCosts = Math.round(numValue * 0.03);
    setValue('closingCosts', calculatedClosingCosts);

    // Auto-calculate loan amount
    if (numValue > watchedDownPayment) {
      setValue('loanAmount', numValue - watchedDownPayment);
    }
  };

  const handleDownPaymentChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue('downPayment', numValue);

    // Auto-calculate loan amount
    if (watchedPropertyValue > numValue) {
      setValue('loanAmount', watchedPropertyValue - numValue);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View>
          <View style={styles.headerContainer}>
            <Home size={20} color="#3b82f6" />
            <Text style={styles.title}>Property Information</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.grid}>
            {/* Asking Price */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="propertyValue"
                render={({ field: { value } }) => (
                  <InputField
                    label="Asking Price"
                    placeholder="500000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => handlePropertyValueChange(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*  {errors.propertyValue && (
                <Text style={styles.errorText}>{errors.propertyValue.message}</Text>
              )} */}
            </View>

            {/* Down Payment */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="downPayment"
                render={({ field: { value } }) => (
                  <InputField
                    label="Down Payment"
                    placeholder="100000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => handleDownPaymentChange(text)}
                    keyboardType="numeric"
                  />
                )}
              />
              {/*  {errors.downPayment && (
                <Text style={styles.errorText}>{errors.downPayment.message}</Text>
              )} */}
            </View>

            {/* Closing Costs */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="closingCosts"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="Closing Costs"
                    placeholder="15000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                )}
              />
              <Text style={styles.helperText}>
                Auto-calculated at 3% of asking price (editable)
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {/* Total Renovation Costs */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="renovationCosts"
                render={({ field: { value } }) => (
                  <InputField
                    label="Total Renovation Costs"
                    value={formatCurrency(value || 0).replace(', ', '')}
                    editable={false}
                  />
                )}
              />
              <Text style={styles.helperText}>
                Auto-calculated from unit repair costs + itemized renovation costs
              </Text>
            </View>

            {/* Number of Units */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="numberOfUnits"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="Number of Units (1-100)"
                    placeholder="1"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const numValue = parseInt(text) || 0;
                      onChange(numValue);
                      onUpdateUnitsCount(numValue);
                    }}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.separator}></View>

          {/* Itemized Renovation Costs */}
          <View>
            <View style={styles.renovationHeader}>
              <View style={styles.headerItemsContainer}>
                <Home size={18} color="#16a34a" />
                <Text style={styles.sectionTitle}>Itemized Renovation Costs</Text>
              </View>
            </View>

            {renovationFieldArray.fields.length > 0 ? (
              <View style={styles.renovationList}>
                {renovationFieldArray.fields.map((field, index) => (
                  <RenovationItemExpandable
                    key={field.id}
                    field={field}
                    index={index}
                    control={control}
                    onRemoveRenovationItem={onRemoveRenovationItem}
                  />
                ))}
                <OutlineButton
                  size={ButtonSize.MEDIUM}
                  onPress={onAddRenovationItem}
                  rightWidget={<Plus size={16} color="#3b82f6" />}
                  title="Add Item"
                />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Itemized Costs:</Text>
                  <Text style={styles.totalAmount}>{formatCurrency(totalRenovationCost)}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Home size={32} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No renovation items added yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Click "Add Item" to start itemizing your renovation costs
                </Text>
                <OutlineButton
                  style={{ width: '100%' }}
                  size={ButtonSize.MEDIUM}
                  onPress={onAddRenovationItem}
                  rightWidget={<Plus size={16} color="#3b82f6" />}
                  title="Add Item"
                />
              </View>
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
  },
  headerItemsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    width: '100%',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  grid: {
    gap: 8,
  },
  inputContainer: {
    gap: 4,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  currencyInputContainer: {
    flexDirection: 'row',
  },
  currencySymbol: {
    paddingLeft: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  renovationHeader: {
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  renovationList: {
    gap: 8,
  },
  renovationItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renovationItemContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  renovationInput: {
    flex: 1,
  },
  selectTrigger: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
  },
  removeButton: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    width: 30,
    minWidth: 30,
  },
  totalContainer: {
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 8,
    gap: 8,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 16,
  },
  emptyStateSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
});
