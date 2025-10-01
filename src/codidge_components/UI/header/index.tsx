import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
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
  leftText?: string;
  loadingRight?: boolean;
  disabledRight?: boolean;
  contentContainerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  leftWidget?: React.ReactNode;
  titleStyles?: TextStyle;
  rightWidget?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  rightText,
  leftText,
  loadingRight,
  disabledRight,
  contentContainerStyle,
  contentStyle,
  leftWidget,
  titleStyles,
  rightWidget,
}) => {
  return (
    <View style={[styles.container, contentContainerStyle]}>
      <View style={[styles.content, contentStyle]}>
        {/* Left section */}
        <View style={styles.leftSection}>
          <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            {showBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                {leftWidget ? (
                  leftWidget
                ) : (
                  <Icons.ArrowLeft size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
            {leftText && <Text style={styles.title}>{leftText}</Text>}
          </View>
        </View>

        {/* Center section */}
        <View style={styles.centerSection}>
          <Text style={[styles.title, titleStyles]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right section */}
        <View style={styles.rightSection}>
          {rightWidget
            ? rightWidget
            : rightAction && (
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
