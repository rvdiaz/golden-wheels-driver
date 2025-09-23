// components/InvestmentCalculator.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Home, Building, Calculator, Percent, ClipboardList } from 'lucide-react-native';
import { PropertyForm } from './widgets/propertyInformation';
import { FinancingForm } from './widgets/financingForm';
import { ResultsDisplay } from './widgets/resultsComponent';
import { GridTabs } from '~/codidge_components/UI/tabs';
import { useInvestmentForm } from './custom_hooks';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { MobileUnitsForm } from './widgets/unitsForm';
import { ExpensesForm } from './widgets/expenesForm';

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
      key: 'overview',
      label: 'Overview',
      Icon: ClipboardList,
    },
  ];

  const renderActiveScene = () => {
    switch (activeTab) {
      case 'property':
        return <PropertyForm form={form} />;
      case 'units':
        return (
          <MobileUnitsForm
            form={form}
            totalRenovationCost={totalRenovationCost}
            renovationFieldArray={renovationFieldArray}
            unitsFieldArray={unitsFieldArray}
            removeUnit={removeUnit}
            onAddRenovationItem={addRenovationItem}
            onRemoveRenovationItem={removeRenovationItem}
            onUpdateUnitsCount={updateUnitsCount}
          />
        );
      case 'expenses':
        return <ExpensesForm form={form} />;

      case 'overview':
        return (
          <FinancingForm form={form} isCalculating={isCalculating} onSubmit={calculateAnalysis} />
        );
      default:
        return <PropertyForm form={form} />;
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
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles.tabHeaderWrapper}>
          <GridTabs tabs={tabs} initialTabKey="property" onTabChange={setActiveTab} />
        </View>

        <View style={styles.content}>{renderActiveScene()}</View>
      </KeyboardAvoidingView>
      <Modal
        visible={showResults && !!results}
        animationType="slide"
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
