import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { BottomSheetModal } from '~/components/bottomSheetModal';
import { theme } from '~/theme/theme';

const GOLD = theme.colors.primary;

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  variant?: 'light' | 'dark';
}

// ─── Option row ───────────────────────────────────────────────────────────────

const OptionRow = ({
  item,
  isSelected,
  onPress,
}: {
  item: SelectOption;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[opt.row, isSelected && opt.rowSelected]}>
    <Text style={[opt.label, isSelected && opt.labelSelected]} numberOfLines={1}>
      {item.label}
    </Text>
    {isSelected && <Check size={15} color={GOLD} strokeWidth={2.5} />}
  </TouchableOpacity>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  variant = 'light',
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isDark = variant === 'dark';

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
  };

  // ── Dark variant ──────────────────────────────────────────────────────────

  if (isDark) {
    return (
      <>
        <View style={dk.wrapper}>
          {label && (
            <Text style={dk.label}>
              {label}
              {required && <Text style={{ color: '#EF4444' }}> *</Text>}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => !disabled && setOpen(true)}
            activeOpacity={0.75}
            disabled={disabled}>
            <LinearGradient
              colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[dk.row, error && dk.rowError, disabled && dk.disabled]}>
              <Text style={[dk.value, !selected && dk.placeholder]} numberOfLines={1}>
                {selected?.label ?? placeholder}
              </Text>
              <ChevronDown size={16} color="rgba(212,168,83,0.5)" />
            </LinearGradient>
          </TouchableOpacity>
          {errorMessage && <Text style={dk.error}>{errorMessage}</Text>}
        </View>

        <BottomSheetModal
          visible={open}
          onClose={() => setOpen(false)}
          title={label ?? 'Select'}
          scrollable={false}
          heightFraction={0.55}
          contentStyle={{ paddingHorizontal: 0, paddingTop: 8 }}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => (
              <OptionRow
                item={item}
                isSelected={item.value === value}
                onPress={() => handleSelect(item)}
              />
            )}
          />
        </BottomSheetModal>
      </>
    );
  }

  // ── Light variant ─────────────────────────────────────────────────────────

  return (
    <>
      <View style={lt.wrapper}>
        {label && (
          <Text style={lt.label}>
            {label}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => !disabled && setOpen(true)}
          activeOpacity={0.75}
          disabled={disabled}
          style={[lt.row, error && lt.rowError, disabled && lt.disabled]}>
          <Text style={[lt.value, !selected && lt.placeholder]} numberOfLines={1}>
            {selected?.label ?? placeholder}
          </Text>
          <ChevronDown size={16} color="#6B7280" />
        </TouchableOpacity>
        {errorMessage && <Text style={lt.error}>{errorMessage}</Text>}
      </View>

      <BottomSheetModal
        visible={open}
        onClose={() => setOpen(false)}
        title={label ?? 'Select'}
        scrollable={false}
        heightFraction={0.55}
        contentStyle={{ paddingHorizontal: 0, paddingTop: 8 }}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <OptionRow
              item={item}
              isSelected={item.value === value}
              onPress={() => handleSelect(item)}
            />
          )}
        />
      </BottomSheetModal>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const opt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212,168,83,0.08)',
  },
  rowSelected: {
    backgroundColor: 'rgba(212,168,83,0.07)',
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  labelSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

const dk = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    gap: 10,
  },
  rowError: { borderColor: 'rgba(239,68,68,0.6)' },
  disabled: { opacity: 0.5 },
  value: { flex: 1, fontSize: 15, fontWeight: '500', color: '#ffffff' },
  placeholder: { color: 'rgba(255,255,255,0.4)' },
  error: { fontSize: 12, color: '#EF4444', marginTop: 5 },
});

const lt = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    backgroundColor: '#ffffff',
  },
  rowError: { borderColor: '#EF4444' },
  disabled: { backgroundColor: '#F3F4F6', opacity: 0.6 },
  value: { flex: 1, fontSize: 16, color: '#1F2937' },
  placeholder: { color: '#9CA3AF' },
  error: { fontSize: 14, color: '#EF4444', marginTop: 4 },
});
