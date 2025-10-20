import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from '~/codidge_components/UI/form/checkbox';

const UploadConsentModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: (dontShowAgain: boolean) => void;
  onCancel: () => void;
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    onConfirm(dontShowAgain); // Pass the checkbox state back
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Upload Contacts to CRM</Text>
          <Text style={styles.message}>
            You're about to upload selected contacts to your CRM account. Do you want to continue?
          </Text>

          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={dontShowAgain}
              onToggle={() => {
                setDontShowAgain((prev) => !prev);
              }}
            />
            <Text style={styles.checkboxLabel}>Don't show this again</Text>
          </View>

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Yes, Upload" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UploadConsentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
