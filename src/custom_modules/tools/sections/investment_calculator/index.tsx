// components/InvestmentCalculator.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Home, Building, Calculator, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { PropertyForm } from './widgets/propertyInformation';
import { ResultsDisplay } from './widgets/results';
import { GridTabs } from '~/codidge_components/UI/tabs';
import { useInvestmentForm } from './custom_hooks';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { MobileUnitsForm } from './widgets/unitsForm';
import { ExpensesForm } from './widgets/expenesForm';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { theme } from '~/theme/theme';

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
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (isLastTab) {
      // On last tab, trigger form submission
      calculateAnalysis();
    } else {
      // Navigate to next tab
      const nextTab = tabs[currentTabIndex + 1];
      setActiveTab(nextTab.key);
    }
  };

  const handleBack = () => {
    if (isFirstTab) {
      // On first tab, go back in navigation
      navigation.goBack();
    } else {
      // Navigate to previous tab
      const prevTab = tabs[currentTabIndex - 1];
      setActiveTab(prevTab.key);
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
          <GridTabs
            activeTabBackground={theme.colors.primary}
            activeTabColor="#FFF"
            activeTabTextColor="#FFF"
            tabs={tabs}
            initialTabKey={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
        <View style={styles.content}>
          <View
            style={{
              display: activeTab === 'property' ? 'flex' : 'none',
              flex: 1,
            }}>
            <PropertyForm form={form} />
          </View>
          <View
            style={{
              display: activeTab === 'units' ? 'flex' : 'none',
              flex: 1,
            }}>
            <MobileUnitsForm
              form={form}
              unitsFieldArray={unitsFieldArray}
              removeUnit={removeUnit}
              onUpdateUnitsCount={updateUnitsCount}
            />
          </View>
          <View
            style={{
              display: activeTab === 'expenses' ? 'flex' : 'none',
              flex: 1,
            }}>
            <ExpensesForm
              form={form}
              totalRenovationCost={totalRenovationCost}
              onAddRenovationItem={addRenovationItem}
              onRemoveRenovationItem={removeRenovationItem}
              renovationFieldArray={renovationFieldArray}
              isCalculating={isCalculating}
              onSubmit={calculateAnalysis}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          {!isFirstTab && (
            <OutlineButton
              style={{
                flex: 1,
              }}
              leftWidget={<ArrowLeft size={16} color={theme.colors.primary} />}
              size={ButtonSize.LARGE}
              title="Back"
              onPress={handleBack}
            />
          )}
          <PrimaryButton
            style={{
              flex: isFirstTab ? 1 : 1,
            }}
            rightWidget={
              !isLastTab ? (
                <ArrowRight size={16} color="#FFF" />
              ) : (
                <Calculator size={16} color="#FFF" />
              )
            }
            size={ButtonSize.LARGE}
            title={isLastTab ? 'Calculate' : 'Next'}
            onPress={handleNext}
            disabled={isLastTab && isCalculating}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={showResults && !!results}
        animationType="slide"
        onRequestClose={() => setShowResults(false)}>
        <ResultsDisplay
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
