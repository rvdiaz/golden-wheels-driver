// components/forms/ExpensesForm.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Building } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface ExpensesFormProps {
  form: UseFormReturn<any>;
}

export const ExpensesForm: React.FC<ExpensesFormProps> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  const renderExpenseField = (
    fieldName: string,
    label: string,
    placeholder: string,
    helperText?: string,
    isProjected: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <InputField
            label={label}
            placeholder={placeholder}
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(parseFloat(text) || 0)}
            keyboardType="numeric"
          />
        )}
      />
      {helperText && (
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

  return (
    <ScrollView style={styles.container}>
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
                  <Text style={[styles.sectionTitle, styles.currentTitle]}>Current Expenses</Text>
                </View>
              </View>
              <View style={styles.sectionColumn}>
                <View style={[styles.sectionHeader, styles.projectedHeader]}>
                  <Text style={[styles.sectionTitle, styles.projectedTitle]}>
                    Projected Expenses
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
    backgroundColor: '#dbeafe',
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
    backgroundColor: '#dcfce7',
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
});
