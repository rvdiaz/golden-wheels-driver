import { MortgageFormValues } from '../interfaces';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { Building, DollarSign, Percent, PercentCircle, TrendingUp } from 'lucide-react-native';
import { TabHeader } from '~/codidge_components/UI/tabs';
import LocationAutocomplete from '~/custom_modules/tools/widgets/locationPropertyTax';
import { AdditionalFields } from './additionalFields';

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

  const iconsSize = 16;

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
            leftIcon={<Building size={iconsSize} />}
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
                  leftIcon={<Percent size={iconsSize} />}
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
                  leftIcon={<DollarSign size={iconsSize} />}
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

      <View
        style={{
          flexDirection: 'row',
          gap: 8, // optional spacing between children (RN 0.71+)
        }}>
        {/* Interest Term */}
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="interestRate"
            rules={{ required: 'Interest Rate is required' }}
            render={({ field: { value, onChange } }) => (
              <InputField
                leftIcon={<PercentCircle size={iconsSize} />}
                label="Interest Rate (%)"
                placeholder="1.6"
                keyboardType="decimal-pad"
                value={value?.toString()}
                onChangeText={onChange}
                error={!!errors.interestRate}
                errorMessage={errors.interestRate?.message}
              />
            )}
          />
        </View>

        {/* Loan Term */}
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="loanTerm"
            rules={{ required: 'Loan Term is required' }}
            render={({ field: { value, onChange } }) => (
              <InputField
                leftIcon={<TrendingUp size={iconsSize} />}
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
        </View>
      </View>

      <LocationAutocomplete
        onSelection={(propTax) => {
          setValue('propertyTaxRate', `${propTax}`);
        }}
      />

      <AdditionalFields />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
});
