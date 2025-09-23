import {
  Building,
  Home,
  DollarSign,
  Bed,
  Bath,
  Wrench,
  TrendingUp,
  Trash2,
  Plus,
} from 'lucide-react-native';
import React from 'react';
import { Controller, UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { useFormatters } from '../custom_hooks';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { UnitData } from '../interfaces';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { RenovationItemExpandable } from './renovationItem';

interface MobileUnitsFormProps {
  form: UseFormReturn<any>;
  unitsFieldArray: UseFieldArrayReturn<any, 'units'>;
  removeUnit: (index: number) => void;
  onUpdateUnitsCount: (count: number) => void;
  renovationFieldArray: UseFieldArrayReturn<any, 'renovationItems'>;
  totalRenovationCost: number;
  onRemoveRenovationItem: (index: number) => void;
  onAddRenovationItem: () => void;
}

// Single Unit Card Component
const UnitCard: React.FC<{
  field: any;
  index: number;
  control: any;
  removeUnit: (index: number) => void;
}> = ({ index, control, removeUnit }) => {
  return (
    <View style={styles.unitCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.unitIcon}>
            <Home size={16} color="#2563eb" />
          </View>
          <Text style={styles.cardTitle}>Unit {index + 1}</Text>
        </View>
        <TouchableOpacity onPress={() => removeUnit(index)} style={styles.deleteButton}>
          <Trash2 size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {/* Bed/Bath Section */}
      <View style={styles.bedBathSection}>
        <Text style={styles.sectionLabel}>Configuration</Text>
        <View style={styles.bedBathRow}>
          <View style={styles.bedBathItem}>
            <Bed size={16} color="#6b7280" />
            <Controller
              control={control}
              name={`units.${index}.bedrooms`}
              render={({ field: { onChange, value } }) => (
                <InputField
                  containerStyle={{
                    marginBottom: 0,
                  }}
                  style={styles.bedBathInput}
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            <Text style={styles.bedBathLabel}>Bed</Text>
          </View>

          <View style={styles.bedBathItem}>
            <Bath size={16} color="#6b7280" />
            <Controller
              control={control}
              name={`units.${index}.bathrooms`}
              render={({ field: { onChange, value } }) => (
                <InputField
                  containerStyle={{
                    marginBottom: 0,
                  }}
                  style={styles.bedBathInput}
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            <Text style={styles.bedBathLabel}>Bath</Text>
          </View>
        </View>
      </View>

      {/* Financial Details */}
      <View style={styles.financialSection}>
        <Text style={styles.sectionLabel}>Financial Details</Text>

        {/* Current Rent */}
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <DollarSign size={14} color="#10b981" />
            <Text style={styles.inputLabel}>Current Rent</Text>
          </View>
          <Controller
            control={control}
            name={`units.${index}.currentRent`}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="0"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        {/* Repair Costs */}
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <Wrench size={14} color="#f59e0b" />
            <Text style={styles.inputLabel}>Repair Costs</Text>
          </View>
          <Controller
            control={control}
            name={`units.${index}.repairCosts`}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="0"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        {/* Potential Rent */}
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <TrendingUp size={14} color="#8b5cf6" />
            <Text style={styles.inputLabel}>Potential Rent</Text>
          </View>
          <Controller
            control={control}
            name={`units.${index}.potentialRent`}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="0"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export const MobileUnitsForm: React.FC<MobileUnitsFormProps> = ({
  form,
  unitsFieldArray,
  renovationFieldArray,
  onUpdateUnitsCount,
  removeUnit,
  totalRenovationCost,
  onRemoveRenovationItem,
  onAddRenovationItem,
}) => {
  const { formatCurrency } = useFormatters();
  const { control, watch } = form;

  const units: UnitData[] = watch('units') || [];

  return (
    <ScrollView style={styles.container}>
      <Card
        style={[
          styles.card,
          {
            marginBottom: 0,
          },
        ]}>
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

        {/* Itemized Renovation Costs */}
        <View style={styles.itemsContainer}>
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
      </Card>

      <Card style={styles.card}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Building size={20} color="#2563eb" />
          <Text style={styles.title}>Unit Details</Text>
        </View>

        <View style={styles.content}>
          {/* Unit Cards */}
          <View style={styles.unitsContainer}>
            {unitsFieldArray.fields.map((field, index) => (
              <UnitCard
                key={field.id}
                field={field}
                index={index}
                control={control}
                removeUnit={removeUnit}
              />
            ))}
          </View>

          {/* Summary Card */}
          {units.length > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Units:</Text>
                <Text style={styles.summaryValue}>{units.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Current Rent:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(units.reduce((sum, unit) => sum + (unit?.currentRent || 0), 0))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Repair Costs:</Text>
                <Text style={[styles.summaryValue, styles.expenseValue]}>
                  {formatCurrency(units.reduce((sum, unit) => sum + (unit?.repairCosts || 0), 0))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Potential Rent:</Text>
                <Text style={[styles.summaryValue, styles.potentialValue]}>
                  {formatCurrency(units.reduce((sum, unit) => sum + (unit?.potentialRent || 0), 0))}
                </Text>
              </View>
            </View>
          )}

          {/* Other Income Section */}
          <View style={styles.otherIncomeCard}>
            <View style={styles.otherIncomeHeader}>
              <DollarSign size={18} color="#059669" />
              <Text style={styles.otherIncomeTitle}>Additional Income</Text>
            </View>
            <Controller
              control={control}
              name="otherIncome"
              render={({ field: { onChange, value } }) => (
                <InputField
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              )}
            />
            <Text style={styles.helperText}>Laundry, parking, storage, vending machines, etc.</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  card: {
    margin: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  unitsContainer: {
    gap: 16,
  },
  unitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },

  // Bed/Bath Section
  bedBathSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bedBathRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bedBathItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  bedBathInput: {
    width: 50,
    height: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginBottom: 0,
    paddingBottom: 0,
    paddingVertical: 0,
  },
  bedBathLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Financial Section
  financialSection: {
    gap: 8,
  },
  inputGroup: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  expenseValue: {
    color: '#dc2626',
  },
  potentialValue: {
    color: '#059669',
  },

  // Other Income Card
  otherIncomeCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  otherIncomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  otherIncomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
  },
  helperText: {
    color: '#059669',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    gap: 4,
    padding: 16,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  renovationHeader: {
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  headerItemsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    width: '100%',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  renovationList: {
    gap: 8,
  },
  totalContainer: {
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
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
