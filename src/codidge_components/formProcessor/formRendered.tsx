import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Text from '~/codidge_components/UI/text';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';
import PhoneInput from '../UI/form/inputs/phoneNumberInput';
import { TextArea } from '../UI/form/inputs/textArea';
import { Select, SelectOption } from '../UI/form/select';
import { Checkbox } from '../UI/form/checkbox';

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'checkbox'
  | 'file'
  | 'phone'
  | 'select';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // for select
  hint?: string;
}

interface FormRendererProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => Promise<{ success: boolean; message: string }>;
  submitLabel?: string;
  variant?: 'light' | 'dark';
}

// ─── Validators ───────────────────────────────────────────────────────────────

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email) || 'Please enter a valid email';
};

const validatePhone = (phone: string) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone) || 'Please enter a valid phone number';
};

// ─── File picker field ────────────────────────────────────────────────────────

// ─── Main FormRenderer ────────────────────────────────────────────────────────

export const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  variant = 'light',
}) => {
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = Object.fromEntries(
    fields.map((f) => [f.name, f.type === 'checkbox' ? false : ''])
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ defaultValues });

  // Auto-clear confirmation after 4s
  useEffect(() => {
    if (!confirmation) return;
    const t = setTimeout(() => setConfirmation(''), 4000);
    return () => clearTimeout(t);
  }, [confirmation]);

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    setSubmitting(true);
    try {
      const res = await onSubmit(data);
      if (res.success) {
        setConfirmation(res.message);
        reset();
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const errorMessage = fieldError?.message as string | undefined;

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label={field.label}
                required={field.required}
                placeholder={field.placeholder}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                errorMessage={errorMessage}
                hint={field.hint}
                variant={variant}
              />
            )}
          />
        );

      case 'email':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label={field.label}
                required={field.required}
                placeholder={field.placeholder ?? 'email@example.com'}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errorMessage}
                hint={field.hint}
                variant={variant}
              />
            )}
          />
        );

      case 'phone':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false,
            }}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                label={field.label}
                required={field.required}
                value={value as string}
                onChangeValue={onChange}
                placeholder={field.placeholder}
                error={!!fieldError}
                errorMessage={errorMessage}
                variant={variant}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <TextArea
                label={field.label}
                required={field.required}
                placeholder={field.placeholder}
                value={value as string}
                onChangeText={onChange}
                error={!!fieldError}
                errorMessage={errorMessage}
                hint={field.hint}
                variant={variant}
              />
            )}
          />
        );

      case 'select': {
        const options: SelectOption[] = (field.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
        }));
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <Select
                label={field.label}
                required={field.required}
                options={options}
                value={value as string}
                onChange={onChange}
                placeholder={field.placeholder}
                error={!!fieldError}
                errorMessage={errorMessage}
                variant={variant}
              />
            )}
          />
        );
      }

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={!!value}
                onToggle={onChange}
                label={field.label}
                labelStyle={variant === 'dark' ? { color: 'rgba(255,255,255,0.8)' } : undefined}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={s.wrapper}>
      {fields.map((field) => (
        <View key={field.name} style={s.fieldWrap}>
          {renderField(field)}
        </View>
      ))}

      <PrimaryButton
        size={ButtonSize.LARGE}
        title={submitLabel}
        onPress={handleSubmit(onFormSubmit)}
        loading={submitting}
        disabled={!isDirty}
        style={s.submitBtn}
      />

      {!!confirmation && (
        <View style={s.confirmation}>
          <Text style={s.confirmationText}>{confirmation}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper: { width: '100%', gap: 4 },
  fieldWrap: { width: '100%' },
  submitBtn: { marginTop: 8 },
  confirmation: {
    marginTop: 12,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  confirmationText: { color: '#0a0a0a', fontSize: 14, fontWeight: '600' },
});

const file = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 5 },
  picker: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FAFAFA',
  },
  pickerText: { fontSize: 14, color: '#9CA3AF' },
  previewWrap: {
    position: 'relative',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: theme.borderRadius.md,
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.borderRadius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
