import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useMutation, useReactiveVar } from '@apollo/client';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { ENV_Vars } from '~/store/env';
import { updateUser, userData } from '~/store/user';
import { updateDriverMutation } from '~/screens/auth/graphql/mutations';
import { useTranslation } from '~/i18n';

/**
 * Whether the driver is taking work.
 *
 * A single row: state on the left, switch on the right. It sits at the top of
 * the dashboard rather than in settings because a driver who is accidentally
 * offline receives nothing and is given no reason why — but it stays small,
 * since the trips below it are what the screen is actually for.
 */
export const AvailabilityCard = () => {
  const { t } = useTranslation();
  const userInfo = useReactiveVar(userData);
  const isAvailable = userInfo?.available ?? false;

  const [pending, setPending] = useState(false);
  const [updateDriver] = useMutation(updateDriverMutation);

  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isAvailable) {
      glow.stopAnimation();
      glow.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isAvailable, glow]);

  const toggle = async (next: boolean) => {
    if (!userInfo?.id || pending) return;

    // Optimistic: the switch must feel instant, and we roll back on failure.
    updateUser({ ...userInfo, available: next });
    setPending(true);
    try {
      await updateDriver({
        variables: {
          tenant: ENV_Vars.tenant,
          driverId: userInfo.id,
          driver: { available: next },
        },
      });
    } catch {
      updateUser({ ...userInfo, available: !next });
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={[styles.card, isAvailable && styles.cardOn]}>
      <View style={styles.dotWrap}>
        {isAvailable && (
          <Animated.View
            style={[
              styles.halo,
              {
                opacity: glow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.55, 0],
                }),
                transform: [
                  {
                    scale: glow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2.6],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        <View style={[styles.dot, isAvailable ? styles.dotOn : styles.dotOff]} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {t(isAvailable ? 'availability.online' : 'availability.offline')}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {t(isAvailable ? 'availability.onlineHint' : 'availability.offlineHint')}
        </Text>
      </View>

      {pending ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Switch
          value={isAvailable}
          onValueChange={toggle}
          trackColor={{
            false: theme.colors.borderStrong,
            true: theme.colors.success,
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.colors.borderStrong}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...surfaces.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  cardOn: { borderColor: theme.colors.success + '55' },

  dotWrap: { width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotOn: { backgroundColor: theme.colors.success },
  dotOff: { backgroundColor: theme.colors.borderStrong },

  textBlock: { flex: 1 },
  title: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  subtitle: { fontSize: typography.xs, color: theme.colors.textColor, marginTop: 1 },
});
