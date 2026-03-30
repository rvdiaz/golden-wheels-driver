import React, { ReactNode, useRef, useState } from 'react';
import {
  Platform,
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, ChevronRight, Check } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import InputField from './inputField';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = theme.colors.primary;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DateInputFieldProps {
  value?: Date;
  onChangeText?: (val: Date) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  mode?: 'date' | 'time' | 'datetime';
  required?: boolean;
  hint?: string;
  placeholder?: string;
  icon?: ReactNode;
}

// ─── iOS Sheet ────────────────────────────────────────────────────────────────
// A self-contained bottom sheet that wraps the DateTimePicker spinner on iOS.
// For datetime mode it shows both pickers in sequence with a step indicator.

const IOSDateSheet = ({
  visible,
  mode,
  initialDate,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  mode: 'date' | 'time' | 'datetime';
  initialDate: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Internal working date — only committed on "Confirm"
  const [workingDate, setWorkingDate] = useState(initialDate);
  // For datetime mode: which step is active
  const [step, setStep] = useState<'date' | 'time'>('date');

  React.useEffect(() => {
    // Reset state each time the sheet opens
    if (visible) {
      setWorkingDate(initialDate);
      setStep('date');
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handlePickerChange = (_: any, selected?: Date) => {
    if (selected) setWorkingDate(selected);
  };

  const handleNext = () => {
    // datetime mode: advance from date → time step
    if (mode === 'datetime' && step === 'date') {
      setStep('time');
    } else {
      onConfirm(workingDate);
    }
  };

  const handleBack = () => {
    if (mode === 'datetime' && step === 'time') {
      setStep('date');
    } else {
      onCancel();
    }
  };

  // What the picker is currently showing
  const activePickerMode: 'date' | 'time' = mode === 'datetime' ? step : (mode as 'date' | 'time');

  const isLastStep = mode !== 'datetime' || step === 'time';

  const stepLabel =
    mode === 'datetime'
      ? step === 'date'
        ? 'Select Date'
        : 'Select Time'
      : mode === 'time'
        ? 'Select Time'
        : 'Select Date';

  const stepSubLabel =
    mode === 'datetime' ? (step === 'date' ? 'Then choose time →' : '← Back to date') : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[sheet.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[sheet.container, { transform: [{ translateY: slideAnim }] }]}>
        {/* Blur + dark base */}
        <BlurView
          intensity={65}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
        />
        <LinearGradient
          colors={['rgba(2,6,23,0.94)', 'rgba(2,6,23,0.98)']}
          style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
        />

        {/* Gold top border */}
        <LinearGradient
          colors={['transparent', GOLD, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={sheet.topBorder}
        />

        {/* Handle */}
        <View style={sheet.handle} />

        {/* Header */}
        <View style={sheet.header}>
          <View style={sheet.iconWrap}>
            {activePickerMode === 'date' ? (
              <Calendar size={16} color={GOLD} />
            ) : (
              <Clock size={16} color={GOLD} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={sheet.title}>{stepLabel}</Text>
          </View>

          {/* Step dots for datetime mode */}
          {mode === 'datetime' && (
            <View style={sheet.stepDots}>
              <View style={[sheet.dot, step === 'date' && sheet.dotActive]} />
              <View style={[sheet.dot, step === 'time' && sheet.dotActive]} />
            </View>
          )}
        </View>

        {/* Picker — tinted to match dark theme */}
        <View style={sheet.pickerWrap}>
          <DateTimePicker
            value={workingDate}
            mode={activePickerMode}
            display="spinner"
            onChange={handlePickerChange}
            textColor="#ffffff"
            themeVariant="dark"
            style={sheet.picker}
          />
        </View>

        {/* Actions */}
        <View style={sheet.actions}>
          {/* Cancel / Back */}
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={sheet.cancelBtn}>
            <Text style={sheet.cancelLabel}>
              {mode === 'datetime' && step === 'time' ? '← Back' : 'Cancel'}
            </Text>
          </TouchableOpacity>

          {/* Confirm / Next */}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient
              colors={['#D4A853', '#C49440']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={sheet.confirmBtn}>
              {isLastStep ? (
                <>
                  <Check size={16} color="#0a0a0a" />
                  <Text style={sheet.confirmLabel}>Confirm</Text>
                </>
              ) : (
                <>
                  <Text style={sheet.confirmLabel}>Next</Text>
                  <ChevronRight size={16} color="#0a0a0a" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Safe area spacer */}
        <View style={{ height: 24 }} />
      </Animated.View>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const DateTimeInputField: React.FC<DateInputFieldProps> = ({
  value,
  onChangeText,
  label,
  error,
  errorMessage,
  mode = 'date',
  required,
  hint,
  placeholder,
  icon,
}) => {
  const [showModal, setShowModal] = useState(false);
  // Android datetime: two-step state
  const [androidStep, setAndroidStep] = useState<'date' | 'time'>('date');
  const [androidTempDate, setAndroidTempDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const safeDate = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  // ── Android native picker handler ────────────────────────────────────────
  const handleAndroidChange = (_: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowModal(false);
      setAndroidStep('date');
      return;
    }

    if (mode === 'datetime') {
      if (androidStep === 'date') {
        setAndroidTempDate(new Date(selectedDate));
        setAndroidStep('time');
        // Keep showModal true so the time picker appears
      } else {
        const finalDate = new Date(
          androidTempDate.getFullYear(),
          androidTempDate.getMonth(),
          androidTempDate.getDate(),
          selectedDate.getHours(),
          selectedDate.getMinutes()
        );
        onChangeText?.(finalDate);
        setShowModal(false);
        setAndroidStep('date');
      }
    } else {
      onChangeText?.(selectedDate);
      setShowModal(false);
    }
  };

  const getAndroidMode = (): 'date' | 'time' => {
    if (mode === 'datetime') return androidStep;
    return mode as 'date' | 'time';
  };

  // ── Display value for the trigger field ──────────────────────────────────
  const inputValue = value
    ? mode === 'time'
      ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : mode === 'datetime'
        ? value.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : value.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <>
      <InputField
        variant="dark"
        label={label ?? 'Pickup Date & Time'}
        value={inputValue}
        placeholder={placeholder ?? 'Select date and time'}
        icon={icon ?? <Calendar size={16} color={GOLD} />}
        onPress={() => setShowModal(true)}
        errorMessage={errorMessage}
      />

      {/* ── Android: native system picker (no custom styling possible) ── */}
      {Platform.OS === 'android' && showModal && (
        <DateTimePicker
          value={mode === 'datetime' && androidStep === 'time' ? androidTempDate : safeDate}
          mode={getAndroidMode()}
          display={getAndroidMode() === 'date' ? 'calendar' : 'clock'}
          onChange={handleAndroidChange}
        />
      )}

      {/* ── iOS: branded dark glass bottom sheet ── */}
      {Platform.OS === 'ios' && (
        <IOSDateSheet
          visible={showModal}
          mode={mode}
          initialDate={safeDate}
          onConfirm={(date) => {
            onChangeText?.(date);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const sheet = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(212,168,83,0.3)',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(212,168,83,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
  },
  dotActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  pickerWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.1)',
  },
  picker: {
    height: 200,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  confirmLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a0a0a',
    letterSpacing: 0.2,
  },
});
