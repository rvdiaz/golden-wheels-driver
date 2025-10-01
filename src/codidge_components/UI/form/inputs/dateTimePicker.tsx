import React, { useState } from 'react';
import { Platform, TouchableOpacity, Modal, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import InputField from './inputField';

interface DateInputFieldProps {
  value?: Date;
  onChangeText?: (val: Date) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  mode?: 'date' | 'time' | 'datetime';
  required?: boolean;
  hint?: string;
}

export const DateTimeInputField: React.FC<DateInputFieldProps> = ({
  value,
  onChangeText,
  label,
  error,
  errorMessage,
  mode = 'date',
  required,
  hint,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date>(value ? new Date(value) : new Date());

  const date = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowModal(false);
      setStep('date'); // reset step when cancelled
      return;
    }

    if (Platform.OS === 'android' && mode === 'datetime') {
      if (step === 'date') {
        // Save selected date and then open time picker
        const newDate = new Date(selectedDate);
        setTempDate(newDate);
        setStep('time'); // switch to time picker
      } else {
        // Combine with previously selected date
        const finalDate = new Date(
          tempDate.getFullYear(),
          tempDate.getMonth(),
          tempDate.getDate(),
          selectedDate.getHours(),
          selectedDate.getMinutes()
        );
        onChangeText?.(finalDate);
        setShowModal(false);
        setStep('date'); // reset for next time
      }
    } else {
      // Normal case (iOS datetime OR Android date/time separately)
      onChangeText?.(selectedDate);
      if (Platform.OS === 'android') {
        setShowModal(false);
      }
    }
  };

  // Determine which mode to show on Android
  const getAndroidMode = () => {
    if (mode === 'datetime') {
      return step; // use step for datetime mode
    }
    return mode; // use the mode directly for 'date' or 'time'
  };

  const inputValue = value
    ? mode === 'time'
      ? value.toLocaleTimeString()
      : mode === 'datetime'
        ? value.toLocaleString()
        : value.toDateString()
    : '';

  return (
    <>
      <InputField
        required={required}
        label={label}
        value={inputValue}
        editable={false}
        rightIcon={
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Clock size={16} color="#6B7280" style={{ marginRight: 16 }} />
          </TouchableOpacity>
        }
        error={error}
        errorMessage={errorMessage}
        hint={hint}
      />

      {Platform.OS === 'android' && showModal && (
        <DateTimePicker
          value={date}
          mode={getAndroidMode()}
          display={getAndroidMode() === 'date' ? 'calendar' : 'clock'}
          onChange={handleChange}
        />
      )}

      {/* On iOS wrap in modal with Done button */}
      {Platform.OS === 'ios' && showModal && (
        <Modal transparent animationType="slide" visible={showModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
              <DateTimePicker value={date} mode={mode} display="spinner" onChange={handleChange} />
              <Button title="Done" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
