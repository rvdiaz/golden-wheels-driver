import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Icons from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: () => void;
  rightText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  rightText,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icons.ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.rightButton}>
            <Text style={styles.rightButtonText}>{rightText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  rightButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rightButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
});
