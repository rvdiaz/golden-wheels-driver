// components/results/TargetAnalysis.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormatters } from '../custom_hooks';
import { TargetResults } from '../interfaces';
import { Card } from '~/codidge_components/UI/card';
import { Edit, Target } from 'lucide-react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';

interface TargetAnalysisProps {
  onCalculateTarget: (targetCapRate: number, targetCashOnCash: number) => void;
  targetResults: TargetResults | null;
  showTargetAnalysis: boolean;
  onToggleTargetAnalysis: (show: boolean) => void;
}

export const TargetAnalysis: React.FC<TargetAnalysisProps> = ({
  onCalculateTarget,
  targetResults,
  showTargetAnalysis,
  onToggleTargetAnalysis,
}) => {
  const [targetCapRate, setTargetCapRate] = useState('8');
  const [targetCashOnCash, setTargetCashOnCash] = useState('12');
  const { formatCurrency } = useFormatters();

  const handleCalculateTarget = () => {
    const capRate = parseFloat(targetCapRate) || 8;
    const cashOnCash = parseFloat(targetCashOnCash) || 12;
    onCalculateTarget(capRate, cashOnCash);
  };

  return (
    <Card style={styles.card}>
      <View>
        <View style={styles.headerContainer}>
          <Target size={20} color="#7c3aed" />
          <Text style={styles.title}>Target Analysis Tool</Text>
        </View>
        <Text style={styles.subtitle}>
          Enter your desired returns to get a recommended purchase price
        </Text>
      </View>

      <View style={styles.content}>
        {!showTargetAnalysis ? (
          <View style={styles.inputSection}>
            <View style={styles.inputGrid}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Desired Cap Rate (%)</Text>
                <InputField
                  style={styles.input}
                  placeholder="8.0"
                  value={targetCapRate}
                  onChangeText={setTargetCapRate}
                  keyboardType="numeric"
                />
                <Text style={styles.helperText}>Typical range: 6-12%</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Desired Cash-on-Cash ROI (%)</Text>
                <InputField
                  style={styles.input}
                  placeholder="12.0"
                  value={targetCashOnCash}
                  onChangeText={setTargetCashOnCash}
                  keyboardType="numeric"
                />
                <Text style={styles.helperText}>Typical range: 8-20%</Text>
              </View>
            </View>

            <PrimaryButton
              size={ButtonSize.LARGE}
              onPress={handleCalculateTarget}
              style={styles.calculateButton}
              rightWidget={<Target size={16} color="#ffffff" />}
              title="Get Recommended Price"
            />
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Purchase Price Recommendations</Text>
              <OutlineButton
                title="Edit Targets"
                onPress={() => onToggleTargetAnalysis(false)}
                style={styles.editButton}
                rightWidget={<Edit size={16} color="#7c3aed" />}
              />
            </View>

            {targetResults && (
              <>
                <View style={styles.recommendationsGrid}>
                  <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationLabel}>Recommended Purchase Price</Text>
                    <Text style={styles.recommendationValue}>
                      {formatCurrency(targetResults.recommendedPurchasePrice)}
                    </Text>
                    <Text style={styles.recommendationSubtext}>
                      Conservative price to meet both targets
                    </Text>
                  </View>

                  <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationLabel}>Maximum Offer Price</Text>
                    <Text style={styles.recommendationValue}>
                      {formatCurrency(targetResults.maxOfferPrice)}
                    </Text>
                    <Text style={styles.recommendationSubtext}>
                      90% of recommended (negotiation buffer)
                    </Text>
                  </View>
                </View>

                <View style={styles.breakdownSection}>
                  <Text style={styles.breakdownTitle}>Analysis Breakdown:</Text>
                  <View style={styles.breakdownGrid}>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Target Cap Rate:</Text>
                      <Text style={styles.breakdownValue}>{targetCapRate}%</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Target Cash-on-Cash:</Text>
                      <Text style={styles.breakdownValue}>{targetCashOnCash}%</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Cap Rate Based Price:</Text>
                      <Text style={styles.breakdownValue}>
                        {formatCurrency(targetResults.capRateBasedPrice)}
                      </Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Cash-on-Cash Based Price:</Text>
                      <Text style={styles.breakdownValue}>
                        {formatCurrency(targetResults.cashOnCashBasedPrice)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>
                      <Text style={styles.explanationBold}>How it works:</Text> We calculate the
                      maximum price you can pay to achieve your target returns. The recommended
                      price is the lower of the two calculations to ensure you meet both targets.
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#faf5ff',
    borderColor: '#a855f7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#7c2d12',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#7c3aed',
    marginTop: 4,
  },
  content: {
    paddingVertical: 16,
  },
  inputSection: {
    gap: 16,
  },
  inputGrid: {
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    color: '#7c3aed',
    fontSize: 12,
    marginTop: 2,
  },
  calculateButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    padding: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    gap: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c2d12',
  },
  editButton: {
    borderColor: '#c4b5fd',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 14,
    color: '#7c3aed',
  },
  recommendationsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendationCard: {
    flex: 1,
    backgroundColor: '#e9d5ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c084fc',
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
    marginBottom: 8,
    textAlign: 'center',
  },
  recommendationValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#581c87',
    marginBottom: 4,
  },
  recommendationSubtext: {
    fontSize: 12,
    color: '#7c3aed',
    textAlign: 'center',
  },
  breakdownSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#c4b5fd',
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7c2d12',
  },
  breakdownGrid: {
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#7c3aed',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  explanationBox: {
    backgroundColor: '#ddd6fe',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  explanationText: {
    fontSize: 12,
    color: '#7c2d12',
    lineHeight: 16,
  },
  explanationBold: {
    fontWeight: '600',
  },
});
