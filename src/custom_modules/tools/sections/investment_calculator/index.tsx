// components/InvestmentCalculator.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Home, Building, Calculator, Percent } from 'lucide-react-native';
import { PropertyForm } from './widgets/propertyInformation';
import { ExpensesForm } from './widgets/expensesForm';
import { FinancingForm } from './widgets/financingForm';
import { ResultsDisplay } from './widgets/resultsComponent';
import { GridTabs } from '~/codidge_components/UI/tabs';
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
    removeUnit,
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
          <MobileUnitsForm form={form} unitsFieldArray={unitsFieldArray} removeUnit={removeUnit} />
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
      <View style={styles.content}>
        <View style={styles.tabHeaderWrapper}>
          <GridTabs tabs={tabs} initialTabKey="property" onTabChange={setActiveTab} />
        </View>
        <View style={styles.content}>{renderActiveScene()}</View>
      </View>

      <Modal
        visible={showResults && !!results}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResults(false)}>
        <ResultsDisplay
          onEditInputs={() => setShowResults(false)}
          onReset={() => {
            resetForm();
          }}
          results={results!}
          onDispose={() => {
            setShowResults(false);
          }}
        />
      </Modal>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  tabHeaderWrapper: {
    paddingTop: 12,
    backgroundColor: '#fff', // needed for shadow to show properly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // only bottom
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
    zIndex: 1, // make sure it stays above content
  },
});

export default InvestmentCalculatorScreen;
