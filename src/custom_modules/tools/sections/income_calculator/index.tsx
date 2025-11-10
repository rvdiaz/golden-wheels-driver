import React, { useState } from 'react';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { useNavigation } from '@react-navigation/native';
import IncomeCalculator from './incomeCalculatorSliders';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';
import MetricsModal from './metricsModal';

export const IncomeCalculatorPage = () => {
  const navigation = useNavigation();
  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <PageSafeContainer>
      <Header
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
        title="Income Calculator"
        rightWidget={
          <TouchableOpacity onPress={() => setShowMetrics(true)} style={styles.metricsButton}>
            <Icons.Info size={16} color="#6B7280" />
            <Text style={styles.metricsButtonText}>Metrics</Text>
          </TouchableOpacity>
        }
      />
      <IncomeCalculator />
      <MetricsModal visible={showMetrics} onClose={() => setShowMetrics(false)} />
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  metricsButtonText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  metricsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
