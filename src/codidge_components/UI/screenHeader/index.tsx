import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { LanguageSwitcher } from '~/codidge_components/UI/languageSwitcher';

/**
 * The title block for a top-level tab screen.
 *
 * One component so Dashboard, Trips, Alerts and Account share a single title
 * treatment — they had drifted into four different ones (a custom greeting, a
 * bare view, the sub-page `Header` with an empty title and a leftWidget hack,
 * and no title at all).
 *
 * Sub-pages are deliberately NOT this: they use `UI/header`, which carries a
 * back button and a centred title. Top level has no back, so the title is
 * left-aligned and large.
 */
export const ScreenHeader = ({
  title,
  eyebrow,
  subtitle,
  right,
  showLanguageSwitcher = true,
}: {
  title: string;
  /** Small line above the title — context, not a label. */
  eyebrow?: string;
  /** Small line below the title — a count, a status, a hint. */
  subtitle?: string;
  right?: React.ReactNode;
  /** Off for headers that already own their top-right slot. */
  showLanguageSwitcher?: boolean;
}) => (
  <View style={styles.wrap}>
    <View style={styles.textBlock}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    <View style={styles.right}>
      {right}
      {showLanguageSwitcher ? <LanguageSwitcher /> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  textBlock: { flex: 1 },
  eyebrow: {
    fontSize: typography.sm,
    color: theme.colors.textColor,
    marginBottom: 1,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: theme.colors.primaryText,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: typography.xs,
    color: theme.colors.textColor,
    marginTop: 2,
  },
  right: { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
