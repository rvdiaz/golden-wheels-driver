// components/forms/ExpensesForm.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, StyleSheet, ScrollView } from 'react-native';

import { Building } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';

interface ExpensesFormProps {
  form: UseFormReturn<any>;
}

export const ExpensesFormScrolling: React.FC<ExpensesFormProps> = ({ form }) => {
  const { control } = form;

  const renderExpenseField = (
    fieldName: string,
    label: string,
    placeholder: string,
    helperText?: string
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
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} horizontal={false}>
      <Card style={styles.card}>
        <View>
          <View style={styles.headerContainer}>
            <Building size={20} color="#ea580c" />
            <Text style={styles.title}>Monthly Expenses</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.expensesGrid}>
              {/* Section Headers */}
              <View style={styles.sectionsRow}>
                <View style={styles.sectionColumn}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Current Expenses</Text>
                  </View>
                </View>
                <View style={styles.sectionColumn}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Projected Expenses</Text>
                  </View>
                </View>
              </View>

              {/* Expense Fields */}
              <View style={styles.fieldsContainer}>
                {/* Insurance Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('currentInsurance', 'Insurance', '200')}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('projectedInsurance', 'Insurance', '250')}
                  </View>
                </View>

                {/* Property Taxes Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('currentPropertyTaxes', 'Property Taxes', '400')}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('projectedPropertyTaxes', 'Property Taxes', '500')}
                  </View>
                </View>

                {/* Maintenance & Repairs Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('currentMaintenance', 'Maintenance & Repairs', '300')}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField('projectedMaintenance', 'Maintenance & Repairs', '400')}
                  </View>
                </View>

                {/* Management Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'currentManagementPercent',
                      'Management (% of income)',
                      '8',
                      'Typical range: 6-12%'
                    )}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'projectedManagementPercent',
                      'Management (% of income)',
                      '8',
                      'Typical range: 6-12%'
                    )}
                  </View>
                </View>

                {/* Vacancy Rate Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'currentVacancy',
                      'Vacancy Rate (%)',
                      '5',
                      'Typical range: 3-8%'
                    )}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'projectedVacancy',
                      'Vacancy Rate (%)',
                      '3',
                      'Typical range: 3-8%'
                    )}
                  </View>
                </View>

                {/* Other Expenses Row */}
                <View style={styles.fieldRow}>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'currentOtherExpenses',
                      'Other Expenses',
                      '100',
                      'Legal, accounting, etc.'
                    )}
                  </View>
                  <View style={styles.sectionColumn}>
                    {renderExpenseField(
                      'projectedOtherExpenses',
                      'Other Expenses',
                      '150',
                      'Legal, accounting, etc.'
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
    padding: 16,
    minWidth: 600, // Ensure minimum width for horizontal layout
  },
  expensesGrid: {
    gap: 16,
  },
  sectionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionColumn: {
    flex: 1,
    minWidth: 280, // Minimum width for each column
  },
  sectionHeader: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  inputContainer: {
    gap: 4,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
});
