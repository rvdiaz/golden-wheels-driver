import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { LANGUAGES, LANGUAGE_SHORT, useTranslation } from '~/i18n';

/**
 * EN / ES segmented toggle for the header's top-right slot.
 *
 * A segmented control rather than a dropdown: with exactly two options, showing
 * both makes the current one obvious and switching a single tap — and it reads
 * at a glance for a driver who may not be able to parse the interface language
 * they're currently stuck in.
 */
export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <View style={styles.wrap}>
      {LANGUAGES.map((lng) => {
        const active = lng === language;
        return (
          <TouchableOpacity
            key={lng}
            onPress={() => setLanguage(lng)}
            activeOpacity={0.75}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {LANGUAGE_SHORT[lng]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.cardBackground,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  segmentActive: { backgroundColor: theme.colors.primaryText },
  label: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: theme.colors.textColor,
    letterSpacing: 0.4,
  },
  labelActive: { color: '#FFFFFF' },
});
