import { StyleSheet, View } from 'react-native';
import { Bell, Clock } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { INotification } from '../interfaces';
import { formatDateTime } from '~/screens/trips/helpers';

const GOLD = theme.colors.primary;
const GOLD_10 = 'rgba(218,192,114,0.10)';
const GOLD_18 = 'rgba(218,192,114,0.18)';
const GOLD_30 = 'rgba(218,192,114,0.30)';
const GLASS_BG = 'rgba(255,255,255,0.07)';
const GLASS_UNREAD_BG = 'rgba(218,192,114,0.07)';
const WHITE_28 = 'rgba(255,255,255,0.28)';
const WHITE_45 = 'rgba(255,255,255,0.45)';
const WHITE_70 = 'rgba(255,255,255,0.70)';
const WHITE_88 = 'rgba(255,255,255,0.88)';

// ─── Notification Card ────────────────────────────────────────────────────────

export const NotificationCard = ({ item }: { item: INotification }) => {
  const isUnread = !item.read;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isUnread ? GLASS_UNREAD_BG : GLASS_BG },
        { borderColor: isUnread ? GOLD_18 : 'rgba(255,255,255,0.09)' },
      ]}>
      {/* Top shimmer */}
      <View
        style={[
          styles.cardShimmer,
          { backgroundColor: isUnread ? 'rgba(218,192,114,0.32)' : 'rgba(255,255,255,0.12)' },
        ]}
      />

      {/* Glass highlight */}
      <View style={styles.glassHighlight} />

      {/* Left accent bar */}
      {isUnread && <View style={styles.accentBar} />}

      <View style={styles.cardInner}>
        {/* Icon */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isUnread ? GOLD_10 : 'rgba(255,255,255,0.06)',
              borderColor: isUnread ? GOLD_30 : 'rgba(255,255,255,0.1)',
            },
          ]}>
          <Bell size={16} color={isUnread ? GOLD : 'rgba(255,255,255,0.35)'} strokeWidth={1.8} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleWrap}>
              <Text
                style={[styles.title, { color: isUnread ? WHITE_88 : WHITE_45 }]}
                numberOfLines={1}>
                {item.title}
              </Text>
              {isUnread && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.timeWrap}>
              <Clock size={10} color="rgba(255,255,255,0.45)" strokeWidth={1.5} />
              <Text style={styles.timestamp}>{formatDateTime(item.createdAt)}</Text>
            </View>
          </View>

          <Text style={[styles.body, { color: isUnread ? WHITE_70 : WHITE_28 }]} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Card ──
  card: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    borderRadius: 1,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2.5,
    backgroundColor: GOLD,
    borderRadius: 2,
    opacity: 0.7,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
    flexShrink: 0,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});
