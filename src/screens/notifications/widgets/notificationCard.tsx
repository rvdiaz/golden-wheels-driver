import { StyleSheet, View } from 'react-native';
import { Bell, Clock } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { INotification } from '../interfaces';
import { formatDateTime } from '~/screens/trips/helpers';

const GOLD = theme.colors.primary;
const GOLD_10 = theme.colors.primaryAlpha[10];
const GOLD_30 = theme.colors.primaryAlpha[35];
// Read cards are plain white; unread get a warm tint so they still stand out.
const CARD_BG = theme.colors.cardBackground;
const CARD_UNREAD_BG = theme.colors.primaryBodyBackground;
const WHITE_28 = theme.colors.textColor;
const WHITE_45 = theme.colors.textColor;
const WHITE_70 = theme.colors.secondaryText;
const WHITE_88 = theme.colors.primaryText;

// ─── Notification Card ────────────────────────────────────────────────────────

export const NotificationCard = ({ item }: { item: INotification }) => {
  const isUnread = !item.read;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: 'white' },
        { borderColor: isUnread ? GOLD_30 : theme.colors.cardBorder },
      ]}>
      {/* Top shimmer */}
      <View
        style={[
          styles.cardShimmer,
          { backgroundColor: isUnread ? theme.colors.primaryAlpha[35] : theme.colors.cardBorder },
        ]}
      />

      {/* Left accent bar */}
      {isUnread && <View style={styles.accentBar} />}

      <View style={styles.cardInner}>
        {/* Icon */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isUnread ? GOLD_10 : theme.colors.baseGray,
              borderColor: isUnread ? GOLD_30 : theme.colors.cardBorder,
            },
          ]}>
          <Bell size={16} color={isUnread ? GOLD : theme.colors.textColor} strokeWidth={1.8} />
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
              <Clock size={10} color={theme.colors.textColor} strokeWidth={1.5} />
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
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    borderRadius: 1,
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
    fontSize: 15,
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
    fontSize: 13,
    color: theme.colors.textColor,
  },
  body: {
    fontSize: 14,
    lineHeight: 18,
  },
});
