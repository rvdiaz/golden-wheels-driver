// components/forms/FinancingForm.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { formatCurrency } from '../helpers';

interface FinancingFormProps {
  form: UseFormReturn<any>;
  isCalculating: boolean;
  onSubmit: () => void;
}

export const FinancingForm: React.FC<FinancingFormProps> = ({ form, onSubmit, isCalculating }) => {
  const { control, watch } = form;
  const renovationCosts = watch('renovationCosts') || 0;

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Card style={styles.cardContainer}>
        {/* Total Renovation Costs Display */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Renovation Costs</Text>
          <Text style={styles.totalAmount}>{formatCurrency(renovationCosts)}</Text>
          <Text style={styles.helperText}>
            Auto-calculated from unit repair costs + itemized renovation costs
          </Text>
        </View>

        {/* Calculate Button */}
        <PrimaryButton
          onPress={onSubmit}
          disabled={isCalculating}
          size={ButtonSize.LARGE}
          rightWidget={<Calculator size={20} color="#ffffff" />}
          title={isCalculating ? 'Calculating...' : 'Calculate Investment Analysis'}
        />
      </Card>
    </View>
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
    gap: 24,
  },
  grid: {
    gap: 16,
  },
  totalContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  inputContainer: {
    gap: 4,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 2,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    margin: 16,
    padding: 16,
  },
});
