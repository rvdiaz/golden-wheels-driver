import { StyleSheet, Text, View } from 'react-native';

export const Badge = ({ children, style, textStyle }: any) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
