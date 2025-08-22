import React, { useState } from 'react';
import { Platform, TouchableOpacity, Modal, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native'; // icon
import InputField from './inputField';

interface DateInputFieldProps {
  value?: Date;
  onChangeText?: (val: Date) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  mode?: 'date' | 'time' | 'datetime'; // NEW: allow different modes
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  value,
  onChangeText,
  label,
  error,
  errorMessage,
  mode = 'date',
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowModal(false); // close modal on Android
    }
    if (selectedDate) {
      onChangeText?.(selectedDate); // YYYY-MM-DD
    }
  };

  const date = value ? new Date(value) : new Date();
  const inputValue = date.toDateString();

  return (
    <>
      <InputField
        label={label}
        value={inputValue}
        editable={false}
        rightIcon={
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Calendar size={16} color="#6B7280" style={{ marginRight: 16 }} />
          </TouchableOpacity>
        }
        error={error}
        errorMessage={errorMessage}
      />

      <Modal transparent animationType="slide" visible={showModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleChange}
            />
            {Platform.OS === 'ios' && <Button title="Done" onPress={() => setShowModal(false)} />}
          </View>
        </View>
      </Modal>
    </>
  );
};
