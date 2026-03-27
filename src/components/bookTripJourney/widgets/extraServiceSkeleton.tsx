import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '~/theme/theme';

export const SkeletonCard = ({ opacity }: { opacity: number }) => (
  <View style={[sk.card, { opacity }]}>
    <View style={sk.iconWrap} />
    <View style={sk.content}>
      <View style={sk.titleLine} />
      <View style={sk.subLine} />
    </View>
    <View style={sk.priceLine} />
  </View>
);

export const LoadingSkeleton = () => (
  <View style={sk.scroll}>
    {[0.9, 0.7, 0.5].map((op, i) => (
      <SkeletonCard key={i} opacity={op} />
    ))}
  </View>
);

const sk = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  titleLine: {
    height: 12,
    width: '60%',
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  subLine: {
    height: 10,
    width: '40%',
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  priceLine: {
    width: 36,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    flexShrink: 0,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
});
