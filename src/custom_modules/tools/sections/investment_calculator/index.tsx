// components/InvestmentCalculator.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Home, Building, Calculator, Percent } from 'lucide-react-native';
import { PropertyForm } from './widgets/propertyInformation';
import { ExpensesForm } from './widgets/expensesForm';
import { FinancingForm } from './widgets/financingForm';
import { ResultsDisplay } from './widgets/resultsComponent';
import { TargetAnalysis } from './widgets/targetAnalysis';
import { ScrollableTabHeader } from '~/codidge_components/UI/tabs';
import { useInvestmentForm } from './custom_hooks';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { MobileUnitsForm } from './widgets/unitsForm';

const InvestmentCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('property');

  const {
    form,
    unitsFieldArray,
    renovationFieldArray,
    results,
    isCalculating,
    showResults,

    // Actions
    calculateAnalysis,
    resetForm,
    updateUnitsCount,
    addRenovationItem,
    removeRenovationItem,
    clearUnit,
    setShowResults,

    // Computed values
    totalRenovationCost,
    totalRepairCosts,
  } = useInvestmentForm();

  const tabs = [
    {
      key: 'property',
      label: 'Property',
      Icon: Home,
      indexNumber:
        renovationFieldArray.fields.length > 0 ? renovationFieldArray.fields.length : undefined,
    },
    {
      key: 'units',
      label: 'Units',
      Icon: Building,
      indexNumber: unitsFieldArray.fields.length > 1 ? unitsFieldArray.fields.length : undefined,
    },
    {
      key: 'expenses',
      label: 'Expenses',
      Icon: Calculator,
    },
    {
      key: 'financing',
      label: 'Financing',
      Icon: Percent,
    },
  ];

  const renderActiveScene = () => {
    switch (activeTab) {
      case 'property':
        return (
          <PropertyForm
            form={form}
            renovationFieldArray={renovationFieldArray}
            totalRenovationCost={totalRenovationCost}
            totalRepairCosts={totalRepairCosts}
            onUpdateUnitsCount={updateUnitsCount}
            onAddRenovationItem={addRenovationItem}
            onRemoveRenovationItem={removeRenovationItem}
          />
        );
      case 'units':
        return (
          <MobileUnitsForm form={form} unitsFieldArray={unitsFieldArray} onClearUnit={clearUnit} />
        );
      case 'expenses':
        return <ExpensesForm form={form} />;
      case 'financing':
        return (
          <FinancingForm
            form={form}
            onCalculate={calculateAnalysis}
            isCalculating={isCalculating}
          />
        );
      default:
        return (
          <PropertyForm
            form={form}
            renovationFieldArray={renovationFieldArray}
            totalRenovationCost={totalRenovationCost}
            totalRepairCosts={totalRepairCosts}
            onUpdateUnitsCount={updateUnitsCount}
            onAddRenovationItem={addRenovationItem}
            onRemoveRenovationItem={removeRenovationItem}
          />
        );
    }
  };

  return (
    <PageSafeContainer
      style={{
        backgroundColor: '#FFFFFF',
        flex: 1,
      }}>
      <Header
        title="Investment Calculator"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      {showResults && results ? (
        <View
          style={{
            flex: 1,
          }}>
          <ResultsDisplay
            results={results}
            onEditInputs={() => setShowResults(false)}
            onReset={resetForm}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <View>
            <ScrollableTabHeader tabs={tabs} initialTabKey="property" onTabChange={setActiveTab} />
          </View>
          <View style={styles.content}>{renderActiveScene()}</View>
        </View>
      )}
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default InvestmentCalculatorScreen;
