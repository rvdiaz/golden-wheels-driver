// EstimatedClosingCostCalculatorForm.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { TabHeader } from '~/codidge_components/UI/tabs';
import {
  DollarSign,
  Percent,
  Home,
  TrendingUp,
  FileText,
  ClipboardCheck,
  BarChart3,
  Shield,
  Calendar,
} from 'lucide-react-native';
import {
  EstimatedClosingCostCalculatorFormProps,
  EstimatedClosingCostFormValues,
} from '../interfaces';

export const EstimatedClosingCostCalculatorForm = ({
  isDownPaymentPercent,
  setIsDownPaymentPercent,
  isBuyerBrokerPercent,
  setIsBuyerBrokerPercent,
}: EstimatedClosingCostCalculatorFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<EstimatedClosingCostFormValues>();

  const iconsSize = 16;

  const tabs = [
    { key: 'dollar', label: '$' },
    { key: 'percent', label: '%' },
  ];

  return (
    <View style={styles.formContainer}>
      {/* Purchase Details Section */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Purchase Details</Text>
        <Controller
          control={control}
          name="purchasePrice"
          rules={{ required: 'Purchase price is required' }}
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<Home size={iconsSize} />}
              label="Purchase Price"
              placeholder="500000"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.purchasePrice}
              errorMessage={errors.purchasePrice?.message}
            />
          )}
        />

        <View style={styles.inputWithToggle}>
          <View style={{ flex: 1, marginRight: 8 }}>
            {isDownPaymentPercent ? (
              <Controller
                control={control}
                name="downPaymentPercent"
                rules={{ required: 'Down Payment is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    leftIcon={<Percent size={iconsSize} />}
                    label="Down Payment"
                    placeholder="20"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.downPaymentPercent}
                    errorMessage={errors.downPaymentPercent?.message}
                    hint="Percentage of purchase price (typical: 20%)"
                  />
                )}
              />
            ) : (
              <Controller
                control={control}
                name="downPayment"
                rules={{ required: 'Down Payment is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    allowCommas={true}
                    leftIcon={<DollarSign size={iconsSize} />}
                    label="Down Payment"
                    placeholder="100000"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.downPayment}
                    errorMessage={errors.downPayment?.message}
                    hint="Dollar amount"
                  />
                )}
              />
            )}
          </View>
          <TabHeader
            containerStyle={{
              width: 100,
              paddingHorizontal: 0,
              marginTop: 16,
              marginBottom: 0,
            }}
            tabs={tabs}
            initialTabKey={isDownPaymentPercent ? 'percent' : 'dollar'}
            onTabChange={(key) => setIsDownPaymentPercent(key === 'percent')}
          />
        </View>
      </View>

      {/* Buyer Broker Compensation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buyer Broker Compensation</Text>

        <View style={styles.inputWithToggle}>
          <View style={{ flex: 1, marginRight: 8 }}>
            {isBuyerBrokerPercent ? (
              <Controller
                control={control}
                name="buyerBrokerCompPercent"
                render={({ field: { value, onChange } }) => (
                  <InputField
                    leftIcon={<Percent size={iconsSize} />}
                    label="Compensation Amount (Optional)"
                    placeholder="2.5"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.buyerBrokerCompPercent}
                    errorMessage={errors.buyerBrokerCompPercent?.message}
                    hint="Percentage of purchase price (if buyer is paying)"
                  />
                )}
              />
            ) : (
              <Controller
                control={control}
                name="buyerBrokerComp"
                render={({ field: { value, onChange } }) => (
                  <InputField
                    allowCommas={true}
                    leftIcon={<DollarSign size={iconsSize} />}
                    label="Compensation Amount (Optional)"
                    placeholder="15000"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.buyerBrokerComp}
                    errorMessage={errors.buyerBrokerComp?.message}
                    hint="Fixed dollar amount (if buyer is paying)"
                  />
                )}
              />
            )}
          </View>
          <TabHeader
            containerStyle={{
              width: 100,
              paddingHorizontal: 0,
              marginTop: 16,
              marginBottom: 0,
            }}
            tabs={tabs}
            initialTabKey={isBuyerBrokerPercent ? 'percent' : 'dollar'}
            onTabChange={(key) => setIsBuyerBrokerPercent(key === 'percent')}
          />
        </View>
      </View>

      {/* Lender Fees Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lender Fees</Text>

        <Controller
          control={control}
          name="originationPoints"
          render={({ field: { value, onChange } }) => (
            <InputField
              leftIcon={<TrendingUp size={iconsSize} />}
              label="Origination Fee (Points)"
              placeholder="3"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.originationPoints}
              errorMessage={errors.originationPoints?.message}
              hint="Lender charges (default: 3 points = 3%)"
            />
          )}
        />

        <Controller
          control={control}
          name="appraisalFee"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<FileText size={iconsSize} />}
              label="Appraisal Fee"
              placeholder="500"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.appraisalFee}
              errorMessage={errors.appraisalFee?.message}
              hint="Property valuation fee (typical: $400-600)"
            />
          )}
        />

        <Controller
          control={control}
          name="creditReportFee"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<BarChart3 size={iconsSize} />}
              label="Credit Report Fee"
              placeholder="50"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.creditReportFee}
              errorMessage={errors.creditReportFee?.message}
              hint="Lender's credit check (typical: $25-75)"
            />
          )}
        />
      </View>

      {/* Inspections & Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspections & Services</Text>

        <Controller
          control={control}
          name="inspectionFee"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<ClipboardCheck size={iconsSize} />}
              label="Home Inspection"
              placeholder="400"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.inspectionFee}
              errorMessage={errors.inspectionFee?.message}
              hint="Professional inspection (typical: $300-500)"
            />
          )}
        />

        <Controller
          control={control}
          name="surveyFee"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<FileText size={iconsSize} />}
              label="Property Survey"
              placeholder="550"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.surveyFee}
              errorMessage={errors.surveyFee?.message}
              hint="Land survey (typical: $400-600)"
            />
          )}
        />

        <Controller
          control={control}
          name="recordingFees"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<FileText size={iconsSize} />}
              label="Recording Fees"
              placeholder="150"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.recordingFees}
              errorMessage={errors.recordingFees?.message}
              hint="County filing fees (typical: $100-200)"
            />
          )}
        />

        <Controller
          control={control}
          name="escrowFee"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<Shield size={iconsSize} />}
              label="Attorney/Escrow Fee"
              placeholder="600"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.escrowFee}
              errorMessage={errors.escrowFee?.message}
              hint="Settlement and legal services (typical: $500-800)"
            />
          )}
        />
      </View>

      {/* Prepaid Items Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prepaid Items (Escrow)</Text>

        <Controller
          control={control}
          name="prepaidTaxes"
          render={({ field: { value, onChange } }) => (
            <InputField
              leftIcon={<Calendar size={iconsSize} />}
              label="Prepaid Property Taxes (Months)"
              placeholder="3"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.prepaidTaxes}
              errorMessage={errors.prepaidTaxes?.message}
              hint="Months of taxes to escrow (typical: 2-6 months)"
            />
          )}
        />

        <Controller
          control={control}
          name="prepaidInsurance"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<Shield size={iconsSize} />}
              label="Prepaid Homeowner's Insurance"
              placeholder="1200"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.prepaidInsurance}
              errorMessage={errors.prepaidInsurance?.message}
              hint="First year premium (typical: $800-1500)"
            />
          )}
        />

        <Controller
          control={control}
          name="prepaidHOA"
          render={({ field: { value, onChange } }) => (
            <InputField
              allowCommas={true}
              leftIcon={<Home size={iconsSize} />}
              label="Prepaid HOA Fees (Optional)"
              placeholder="0"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.prepaidHOA}
              errorMessage={errors.prepaidHOA?.message}
              hint="If applicable (varies by community)"
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  inputWithToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
