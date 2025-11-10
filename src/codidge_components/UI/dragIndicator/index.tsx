import React from 'react';
import { StyleSheet, View } from 'react-native';

export const DragPopupIndicator = () => {
  return <View style={styles.dragIndicator} />;
};

const styles = StyleSheet.create({
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});
