import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as Icons from 'lucide-react-native';
import TextButton from '../button/TextButton';
import { theme } from '~/theme/theme';
import { ButtonSize } from '../button/PrimaryButton';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: () => void;
  rightText?: string;
  loadingRight?: boolean;
  disabledRight?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  rightText,
  loadingRight,
  disabledRight,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.content}>
        {/* Left section */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icons.ArrowLeft size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center section */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right section */}
        <View style={styles.rightSection}>
          {rightAction && (
            <TextButton
              disabled={disabledRight}
              loading={loadingRight}
              size={ButtonSize.MEDIUM}
              textStyle={styles.rightButtonText}
              onPress={rightAction}
              title={rightText ?? ''}
            />
          )}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.headerModal,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.headerModalText,
  },
  rightButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rightButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
