import { Card } from '~/codidge_components/UI/card';
import { MortgageFormValues } from '../interfaces';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import {
  Building,
  DollarSign,
  Percent,
  PercentCircle,
  Shield,
  TrendingUp,
} from 'lucide-react-native';
import { Label } from '~/codidge_components/UI/form/label';
import { TabHeader } from '~/codidge_components/UI/tabs';
import LocationAutocomplete from '~/custom_modules/tools/widgets/locationPropertyTax';

export const MortgageCalculatorForm = ({
  isDownPaymentPercent,
  setIsDownPaymentPercent,
}: {
  isDownPaymentPercent: boolean;
  setIsDownPaymentPercent: (p: boolean) => void;
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();

  const iconsSize = 18;

  const tabs = [
    { key: 'dollar', label: '$' },
    { key: 'percent', label: '%' },
  ];

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="homePrice"
        rules={{ required: 'Home price is required' }}
        render={({ field: { value, onChange } }) => (
          <InputField
            leftIcon={<Building size={iconsSize} style={styles.iconStyle} />}
            label="Home Price"
            placeholder="450000"
            keyboardType="decimal-pad"
            value={value?.toString()}
            onChangeText={onChange}
            error={!!errors.homePrice}
            errorMessage={errors.homePrice?.message}
          />
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          {isDownPaymentPercent ? (
            <Controller
              control={control}
              name="downPaymentPercent"
              rules={{ required: 'Down Payment is required' }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  leftIcon={<Percent size={iconsSize} style={styles.iconStyle} />}
                  label="Down Payment"
                  placeholder="45000"
                  keyboardType="decimal-pad"
                  value={value?.toString()}
                  onChangeText={onChange}
                  error={!!errors.downPaymentPercent}
                  errorMessage={errors.downPaymentPercent?.message}
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
                  leftIcon={<DollarSign size={iconsSize} style={styles.iconStyle} />}
                  label="Down Payment"
                  placeholder="45000"
                  keyboardType="decimal-pad"
                  value={value?.toString()}
                  onChangeText={onChange}
                  error={!!errors.downPayment}
                  errorMessage={errors.downPayment?.message}
                />
              )}
            />
          )}
        </View>
        <TabHeader
          containerStyle={{
            width: 100,
            paddingHorizontal: 0,
            paddingTop: 0,
            marginBottom: 0, // remove default bottom margin
          }}
          tabs={tabs}
          initialTabKey={isDownPaymentPercent ? 'percent' : 'dollar'}
          onTabChange={(key) => setIsDownPaymentPercent(key === 'percent')}
        />
      </View>

      {/* Interest Term */}
      <Controller
        control={control}
        name="interestRate"
        rules={{ required: 'Interest Rate is required' }}
        render={({ field: { value, onChange } }) => (
          <InputField
            leftIcon={<PercentCircle size={iconsSize} style={styles.iconStyle} />}
            label="Interest Rate (Annual %)"
            placeholder="1.6"
            keyboardType="decimal-pad"
            value={value?.toString()}
            onChangeText={onChange}
            error={!!errors.interestRate}
            errorMessage={errors.interestRate?.message}
          />
        )}
      />

      {/* Loan Term */}
      <Controller
        control={control}
        name="loanTerm"
        rules={{ required: 'Loan Term is required' }}
        render={({ field: { value, onChange } }) => (
          <InputField
            leftIcon={<TrendingUp size={iconsSize} style={styles.iconStyle} />}
            label="Loan Term (Years)"
            placeholder="30"
            keyboardType="numeric"
            value={value?.toString()}
            onChangeText={onChange}
            error={!!errors.loanTerm}
            errorMessage={errors.loanTerm?.message}
          />
        )}
      />

      <LocationAutocomplete
        onSelection={(propTax) => {
          setValue('propertyTaxRate', `${propTax}`);
        }}
      />

      {/* Additional Costs */}
      <View style={styles.formContainer}>
        <Label label="Additional Monthly Costs" />

        <Controller
          control={control}
          name="propertyTaxRate"
          rules={{ required: 'Property Tax is required' }}
          render={({ field: { value, onChange } }) => (
            <InputField
              leftIcon={<TrendingUp size={iconsSize} style={styles.iconStyle} />}
              label="Property Tax Rate (Annual %)"
              placeholder="1.5"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.propertyTaxRate}
              errorMessage={errors.propertyTaxRate?.message}
            />
          )}
        />

        {/* Home Insurance */}
        <Controller
          control={control}
          name="homeInsurance"
          rules={{ required: 'Home Insurance is required' }}
          render={({ field: { value, onChange } }) => (
            <InputField
              leftIcon={<Shield size={iconsSize} style={styles.iconStyle} />}
              label="Home Insurance (Annual $)"
              placeholder="150"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.homeInsurance}
              errorMessage={errors.homeInsurance?.message}
            />
          )}
        />

        {/* PMI Rate */}
        <Controller
          control={control}
          name="pmiRate"
          rules={{ required: 'PMI Rate is required' }}
          render={({ field: { value, onChange } }) => (
            <InputField
              label="PMI Rate (Annual %)"
              placeholder="0.5"
              keyboardType="decimal-pad"
              value={value?.toString()}
              onChangeText={onChange}
              error={!!errors.pmiRate}
              errorMessage={errors.pmiRate?.message}
            />
          )}
        />

        {/* HOA Fees */}
        <Controller
          control={control}
          name="hoaFees"
          rules={{ required: 'HOA Fees is required' }}
          render={({ field: { value, onChange } }) => (
            <InputField
              label="HOA Fees (Monthly $)"
              placeholder="0"
              keyboardType="decimal-pad"
              value={value}
              onChangeText={onChange}
              error={!!errors.hoaFees}
              errorMessage={errors.hoaFees?.message}
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
  iconStyle: {
    marginHorizontal: 10,
    color: '#6B7280',
  },
});
