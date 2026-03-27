import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';
import { forwardRef, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextInput,
  TextInputProps,
} from 'react-native';
import Text from '~/codidge_components/UI/text';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFieldProps extends Omit<TextInputProps, 'style' | 'placeholder'> {
  label: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  style?: StyleProp<ViewStyle>;

  // Tappable (readonly) mode — mutually exclusive with editable
  onPress?: () => void;

  // Show chevron only in tappable mode (default: true when onPress provided)
  showChevron?: boolean;

  // Show clear button when there's a value (editable mode)
  clearable?: boolean;
  onClear?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FormField = forwardRef<TextInput, FormFieldProps>(
  (
    {
      label,
      value,
      placeholder,
      icon,
      onPress,
      error,
      style,
      showChevron,
      clearable,
      onClear,
      editable = true,
      onChangeText,
      ...rest
    },
    ref
  ) => {
    const isReadonly = !!onPress;
    const resolvedShowChevron = showChevron ?? isReadonly;
    const showClear = clearable && !isReadonly && value && value.length > 0;

    const inner = (
      <LinearGradient
        colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[field.gradient, !!error && field.gradientError]}>
        {icon && <View style={field.iconWrap}>{icon}</View>}

        {isReadonly ? (
          // ── Readonly / tappable display ──────────────────────────────────
          <Text style={[field.valueText, !value && field.placeholder]} numberOfLines={1}>
            {value || placeholder}
          </Text>
        ) : (
          // ── Editable text input ──────────────────────────────────────────
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.4)"
            editable={editable}
            allowFontScaling={false}
            style={[field.valueText, field.input]}
            {...rest}
          />
        )}

        {/* Right side: chevron, clear, or nothing */}
        {resolvedShowChevron && <ChevronRight size={20} color="rgba(212,168,83,0.5)" />}
        {showClear && (
          <TouchableOpacity
            onPress={() => {
              onClear?.();
              onChangeText?.('');
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color="rgba(255,255,255,0.35)" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    );

    return (
      <View style={[field.wrapper, style]}>
        <Text style={field.label}>{label}</Text>

        {isReadonly ? (
          <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
            {inner}
          </TouchableOpacity>
        ) : (
          inner
        )}

        {error ? <Text style={field.error}>{error}</Text> : null}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

// ─── Styles ───────────────────────────────────────────────────────────────────

const field = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    gap: 10,
  },
  gradientError: {
    borderColor: 'rgba(239,68,68,0.6)',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  input: {
    padding: 0, // remove default TextInput padding so it aligns with the readonly Text
    margin: 0,
  },
  placeholder: {
    color: 'rgba(255,255,255,0.4)',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
  },
});
