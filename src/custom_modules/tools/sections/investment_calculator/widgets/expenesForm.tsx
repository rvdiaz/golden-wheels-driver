// components/forms/ExpensesForm.tsx
import React from 'react';
import { Controller, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Building, Home, Plus, AlertCircle } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { RenovationItemExpandable } from './renovationItem';
import { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { formatCurrency } from '../helpers';
import Text from '~/codidge_components/UI/text';

interface ExpensesFormProps {
  form: UseFormReturn<any>;
  renovationFieldArray: UseFieldArrayReturn<any, 'renovationItems'>;
  totalRenovationCost: number;
  onRemoveRenovationItem: (index: number) => void;
  onAddRenovationItem: () => void;
  onSubmit: () => void;
  isCalculating: boolean;
}

// Helper function to convert value for display
const toDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return '';
  return value.toString();
};

// Helper function to parse input value
const parseNumericInput = (text: string): number | string => {
  if (text === '') return '';
  const num = parseFloat(text);
  return isNaN(num) ? '' : num;
};

export const ExpensesForm: React.FC<ExpensesFormProps> = ({
  form,
  renovationFieldArray,
  totalRenovationCost,
  onRemoveRenovationItem,
  onAddRenovationItem,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const renovationCosts = watch('renovationCosts') || 0;

  const renderExpenseField = (
    fieldName: string,
    label: string,
    placeholder: string,
    helperText?: string,
    isProjected: boolean = false
  ) => {
    // Get error for this field
    const error = errors[fieldName];
    const errorMessage = error?.message as string | undefined;

    return (
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={fieldName}
          render={({ field: { onChange, value } }) => (
            <InputField
              label={label}
              placeholder={placeholder}
              value={toDisplayValue(value)}
              onChangeText={(text) => onChange(parseNumericInput(text))}
              keyboardType="numeric"
            />
          )}
        />
        {errorMessage && (
          <View style={styles.errorContainer}>
            <AlertCircle size={12} color="#dc2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        {!errorMessage && helperText && (
          <Text
            style={[
              styles.helperText,
              isProjected ? styles.helperTextProjected : styles.helperTextCurrent,
            ]}>
            {helperText}
          </Text>
        )}
      </View>
    );
  };

  // Check if there are any errors in the form
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView style={styles.container}>
        {/* Error Summary Banner */}
        {hasErrors && (
          <Card style={[styles.card, styles.errorBanner]}>
            <View style={styles.errorBannerContent}>
              <AlertCircle size={20} color="#dc2626" />
              <View style={styles.errorBannerTextContainer}>
                <Text style={styles.errorBannerTitle}>Please fix the following errors:</Text>
                <View style={styles.errorList}>
                  {Object.entries(errors).map(([fieldName, error]) => {
                    const errorMessage = (error as any)?.message;
                    // Convert field names to readable labels
                    const fieldLabel = fieldName
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim();

                    return (
                      <View key={fieldName} style={styles.errorListItem}>
                        <Text style={styles.errorBullet}>•</Text>
                        <Text style={styles.errorListText}>
                          <Text style={styles.errorFieldName}>{fieldLabel}:</Text> {errorMessage}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </Card>
        )}

        <Card
          style={[
            styles.card,
            {
              marginTop: hasErrors ? 8 : 16,
            },
          ]}>
          <View style={styles.itemsContainer}>
            <View style={styles.renovationHeader}>
              <View style={styles.headerItemsContainer}>
                <Home size={18} color="#16a34a" />
                <Text style={styles.sectionTitle}>Itemized Building Renovations</Text>
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
                <Text style={styles.emptyStateText}>This is property level renovations</Text>
                <Text style={styles.emptyStateSubtext}>
                  Examples: Roofing, Pressure washing and painting, Landscaping, etc.
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

        <Card style={[styles.card, { backgroundColor: '#e0f2fe' }]}>
          {/* Total Renovation Costs Display */}
          <View style={styles.totalResultContainer}>
            <Text style={styles.totalLabel}>Total Renovation Costs</Text>
            <Text style={styles.totalAmount}>{formatCurrency(renovationCosts)}</Text>
            <Text style={styles.helperText}>
              Auto-calculated from unit repair costs + itemized building renovation costs
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View>
            <View style={styles.headerContainer}>
              <Building size={20} color="#ea580c" />
              <Text style={styles.title}>Monthly Expenses</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.expensesGrid}>
              {/* Section Headers */}
              <View style={styles.sectionsRow}>
                <View style={styles.sectionColumn}>
                  <View style={[styles.sectionHeader, styles.currentHeader]}>
                    <Text style={[styles.sectionTitle, styles.currentTitle]}>
                      Current{'\n'}Expenses
                    </Text>
                  </View>
                </View>
                <View style={styles.sectionColumn}>
                  <View style={[styles.sectionHeader, styles.projectedHeader]}>
                    <Text style={[styles.sectionTitle, styles.projectedTitle]}>
                      Projected{'\n'}Expenses
                    </Text>
                  </View>
                </View>
              </View>

              {/* Expense Fields */}
              <View style={styles.fieldsContainer}>
                {/* Insurance Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField('currentInsurance', 'Insurance', '200', undefined, false)}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField('projectedInsurance', 'Insurance', '250', undefined, true)}
                  </View>
                </View>

                {/* Property Taxes Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField(
                      'currentPropertyTaxes',
                      'Property Taxes',
                      '400',
                      undefined,
                      false
                    )}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField(
                      'projectedPropertyTaxes',
                      'Property Taxes',
                      '500',
                      undefined,
                      true
                    )}
                  </View>
                </View>

                {/* Maintenance & Repairs Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField(
                      'currentMaintenance',
                      'Maintenance & Repairs',
                      '300',
                      undefined,
                      false
                    )}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField(
                      'projectedMaintenance',
                      'Maintenance & Repairs',
                      '400',
                      undefined,
                      true
                    )}
                  </View>
                </View>

                {/* Management Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField(
                      'currentManagementPercent',
                      'Management (% of income)',
                      '8',
                      'Typical range: 6-12%',
                      false
                    )}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField(
                      'projectedManagementPercent',
                      'Management (% of income)',
                      '8',
                      'Typical range: 6-12%',
                      true
                    )}
                  </View>
                </View>

                {/* Vacancy Rate Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField(
                      'currentVacancy',
                      'Vacancy Rate (%)',
                      '5',
                      'Typical range: 3-8%',
                      false
                    )}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField(
                      'projectedVacancy',
                      'Vacancy Rate (%)',
                      '3',
                      'Typical range: 3-8%',
                      true
                    )}
                  </View>
                </View>

                {/* Other Expenses Row */}
                <View style={styles.fieldRow}>
                  <View style={[styles.sectionColumn, styles.currentSection]}>
                    {renderExpenseField(
                      'currentOtherExpenses',
                      'Other Expenses',
                      '100',
                      'Legal, accounting, etc.',
                      false
                    )}
                  </View>
                  <View style={[styles.sectionColumn, styles.projectedSection]}>
                    {renderExpenseField(
                      'projectedOtherExpenses',
                      'Other Expenses',
                      '150',
                      'Legal, accounting, etc.',
                      true
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
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
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expensesGrid: {
    gap: 16,
  },
  sectionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionColumn: {
    flex: 1,
  },
  sectionHeader: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  // Current section styling (Blue theme)
  currentHeader: {
    borderColor: '#3b82f6',
  },
  currentTitle: {
    color: '#1e40af',
  },
  currentSection: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  helperTextCurrent: {
    color: '#475569',
  },
  // Projected section styling (Green theme)
  projectedHeader: {
    borderColor: '#22c55e',
  },
  projectedTitle: {
    color: '#15803d',
  },
  projectedSection: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  helperTextProjected: {
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  inputContainer: {
    gap: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 2,
  },
  itemsContainer: {
    padding: 16,
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
  totalResultContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 5,
  },
  // Error styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    flex: 1,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 16,
  },
  errorBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  errorBannerTextContainer: {
    flex: 1,
  },
  errorBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  errorBannerSubtext: {
    fontSize: 14,
    color: '#dc2626',
  },
  errorList: {
    gap: 6,
  },
  errorListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  errorBullet: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 2,
  },
  errorListText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
    lineHeight: 18,
  },
  errorFieldName: {
    fontWeight: '600',
  },
});
