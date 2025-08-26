import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ChevronDown, ChevronRight, ChevronUp, Shield, TrendingUp } from 'lucide-react-native';
import { MortgageFormValues } from '../interfaces';
import { Label } from '~/codidge_components/UI/form/label';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

const iconsSize = 16;

export const AdditionalFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();

  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Header with chevron */}
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        style={styles.header}
        activeOpacity={0.7}>
        <Label
          style={{
            marginBottom: 0,
          }}
          label="Additional Monthly Costs"
        />
        {expanded ? (
          <ChevronDown size={20} color="#374151" />
        ) : (
          <ChevronUp size={20} color="#374151" />
        )}
      </TouchableOpacity>

      {/* Expandable content */}
      {expanded && (
        <View style={styles.formContainer}>
          {/* Property Tax */}
          <Controller
            control={control}
            name="propertyTaxRate"
            rules={{ required: 'Property Tax is required' }}
            render={({ field: { value, onChange } }) => (
              <InputField
                leftIcon={<TrendingUp size={iconsSize} />}
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

          {/* Row: Home Insurance + PMI */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="homeInsurance"
                rules={{ required: 'Home Insurance is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    leftIcon={<Shield size={iconsSize} />}
                    label="Home Insurance ($)"
                    placeholder="150"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.homeInsurance}
                    errorMessage={errors.homeInsurance?.message}
                  />
                )}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="pmiRate"
                rules={{ required: 'PMI Rate is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    label="PMI Rate (%)"
                    placeholder="0.5"
                    keyboardType="decimal-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.pmiRate}
                    errorMessage={errors.pmiRate?.message}
                  />
                )}
              />
            </View>
          </View>

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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
