import React from 'react';
import { View, Text } from 'react-native';
import { Calculator, Info } from 'lucide-react-native';
import { useFormContext } from 'react-hook-form';
import { MortgageCalculation, MortgageFormValues } from '../interfaces';
import { formatCurrency, formatCurrencyDetailed } from '../helpers';

interface MortgageCalculatorResultsProps {
  calculation: MortgageCalculation;
}

export const MortgageCalculatorResults: React.FC<MortgageCalculatorResultsProps> = ({
  calculation,
}) => {
  const { watch } = useFormContext<MortgageFormValues>();

  const downPayment = watch('downPayment');
  const homePrice = watch('homePrice');

  return (
    <View>
      {/* Monthly Payment Breakdown */}
      <View>
        <View>
          <Text>
            <Calculator />
            Monthly Payment Breakdown
            {formatCurrency(calculation.monthlyPayment)}
          </Text>
        </View>
        <View>
          {/* Total Monthly Payment */}
          <View>
            <View>
              <Text>Total Monthly Payment</Text>
              <Text>{calculation.monthlyPayment}</Text>
            </View>
          </View>

          {/* Payment Components */}
          <View>
            <View>
              <Text>Principal & Interest</Text>
              <Text> {formatCurrencyDetailed(calculation.principal + calculation.interest)}</Text>
            </View>

            <View>
              <View>
                <Text>• Principal </Text>
                <Text> {formatCurrencyDetailed(calculation.principal)}</Text>
              </View>
              <View>
                <Text>• Interest </Text>
                <Text> {formatCurrencyDetailed(calculation.interest)}</Text>
              </View>
            </View>

            <View>
              <Text>Property Tax</Text>
              <Text> {formatCurrencyDetailed(calculation.propertyTax)}</Text>
            </View>

            <View>
              <Text>Home Insurance</Text>
              <Text> {formatCurrencyDetailed(calculation.insurance)}</Text>
            </View>

            {calculation.pmi > 0 && (
              <View>
                <Text>PMI {'<20% down'}</Text>
                <Text> {formatCurrencyDetailed(calculation.pmi)}</Text>
              </View>
            )}

            {calculation.hoa > 0 && (
              <View>
                <Text>HOA Fees</Text>
                <Text> {formatCurrencyDetailed(calculation.hoa)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Loan Summary */}
      <View>
        <View>
          <Text>
            <Info />
            Loan Summary
          </Text>
        </View>
        <View>
          <View>
            <Text>Loan Amount</Text>
            <Text>{formatCurrency(calculation.totalLoanAmount)}</Text>
          </View>

          <View>
            <Text>Total Interest Paid</Text>
            <Text>{formatCurrency(calculation.totalInterest)}</Text>
          </View>

          <View>
            <Text>Total Cost of Home</Text>
            <Text>{formatCurrency(calculation.totalCost)}</Text>
          </View>

          <View>
            <Text>
              Down Payment: {formatCurrency(parseFloat(downPayment) || 0)} (
              {(((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) * 100).toFixed(1)}
              %)
            </Text>
          </View>
        </View>
      </View>

      {/* No Calculation Message */}
      <View>
        <Calculator />
        <Text>Enter Loan Details</Text>
        <Text>
          Fill in the home price and loan information to see your monthly payment breakdown
        </Text>
      </View>
    </View>
  );
};
