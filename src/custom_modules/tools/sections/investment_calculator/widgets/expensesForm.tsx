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
            {/* Current Expenses */}
            <View style={styles.expenseSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Current Expenses</Text>
              </View>

              <View style={styles.expenseInputs}>
                {/* Insurance */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentInsurance"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Insurance"
                        placeholder="200"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Property Taxes */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentPropertyTaxes"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Property Taxes"
                        placeholder="400"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Maintenance & Repairs */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentMaintenance"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Maintenance & Repairs"
                        placeholder="300"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Management */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentManagementPercent"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Management (% of income)"
                        placeholder="8"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Typical range: 6-12%</Text>
                </View>

                {/* Vacancy Rate */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentVacancy"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Vacancy Rate (%)"
                        placeholder="5"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Typical range: 3-8%</Text>
                </View>

                {/* Other Expenses */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="currentOtherExpenses"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Other Expenses"
                        placeholder="100"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Legal, accounting, etc.</Text>
                </View>
              </View>
            </View>

            {/* Projected Expenses */}
            <View style={styles.expenseSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Projected Expenses</Text>
              </View>

              <View style={styles.expenseInputs}>
                {/* Insurance */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedInsurance"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Insurance"
                        placeholder="250"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Property Taxes */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedPropertyTaxes"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Property Taxes"
                        placeholder="500"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Maintenance & Repairs */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedMaintenance"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Maintenance & Repairs"
                        placeholder="400"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                {/* Management */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedManagementPercent"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Management (% of income)"
                        placeholder="8"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Typical range: 6-12%</Text>
                </View>

                {/* Vacancy Rate */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedVacancy"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Vacancy Rate (%)"
                        placeholder="3"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Typical range: 3-8%</Text>
                </View>

                {/* Other Expenses */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="projectedOtherExpenses"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        label="Other Expenses"
                        placeholder="150"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  <Text style={styles.helperText}>Legal, accounting, etc.</Text>
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
    padding: 16,
  },
  expensesGrid: {
    gap: 8,
  },
  expenseSection: {
    gap: 16,
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
  expenseInputs: {
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
});
