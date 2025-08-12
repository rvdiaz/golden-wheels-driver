import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';

export const ToolsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || '0');
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalAmount = monthlyPayment * numberOfPayments;
      const totalInterest = totalAmount - principal;

      setResult({
        monthlyPayment: monthlyPayment.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        principal: principal.toFixed(2),
      });
    }
  };

  const calculatorTools = [
    {
      icon: 'Home',
      title: 'Prequalified Loan',
      description: 'Calculate loan prequalification',
      screen: 'PrequalifiedLoan',
    },
    {
      icon: 'MapPin',
      title: 'Property Information',
      description: 'Get owner/property info by address',
      screen: 'PropertyInfo',
    },
    {
      icon: 'Clock',
      title: 'Expired Listings',
      description: 'Find expired listings by zip code',
      screen: 'ExpiredListings',
    },
    {
      icon: 'Calculator',
      title: 'Commission Calculator',
      description: 'Calculate your commission',
      screen: 'Commission',
    },
  ];

  const handleToolPress = (tool: any) => {
    if (tool.screen) {
      navigation.navigate(tool.screen as never);
    } else {
      Alert.alert('Coming Soon', `${tool.title} will be available soon!`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Calculator Tools" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.mortgageCard}>
          <Text style={styles.cardTitle}>Mortgage Calculator</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Loan Amount ($)</Text>
            <TextInput
              style={styles.input}
              value={loanAmount}
              onChangeText={setLoanAmount}
              placeholder="400,000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Down Payment ($)</Text>
            <TextInput
              style={styles.input}
              value={downPayment}
              onChangeText={setDownPayment}
              placeholder="80,000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Interest Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="3.5"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Term (Years)</Text>
              <TextInput
                style={styles.input}
                value={loanTerm}
                onChangeText={setLoanTerm}
                placeholder="30"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateMortgage}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Results</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Monthly Payment:</Text>
                <Text style={styles.resultValue}>${result.monthlyPayment}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Amount:</Text>
                <Text style={styles.resultValue}>${result.totalAmount}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Interest:</Text>
                <Text style={styles.resultValue}>${result.totalInterest}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Principal:</Text>
                <Text style={styles.resultValue}>${result.principal}</Text>
              </View>
            </View>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Other Tools</Text>
        <View style={styles.toolsGrid}>
          {calculatorTools.map((tool, index) => {
            const IconComponent = (Icons as any)[tool.icon] || Icons.Calculator;
            return (
              <Card key={index} style={styles.toolCard}>
                <TouchableOpacity style={styles.toolContent} onPress={() => handleToolPress(tool)}>
                  <View style={styles.toolIcon}>
                    <IconComponent size={24} color="#2563EB" />
                  </View>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </TouchableOpacity>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mortgageCard: {
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  calculateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  toolCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  toolContent: {
    padding: 16,
    alignItems: 'center',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
