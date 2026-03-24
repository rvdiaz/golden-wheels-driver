import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { QuickBookOption } from './interfaces';
export const GAP_QUICK_BOOKS = 10;
const { width } = Dimensions.get('window');
const ITEM_SIZE = 149;

export const QuickBookItem = ({ item }: { item: QuickBookOption }) => {
  const GRID_ITEM = (width - 40 - GAP_QUICK_BOOKS) / 2;
  const Icon = item.icon;

  const handlePress = () => {};

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      style={[styles.item, { width: GRID_ITEM }]}>
      {/* Background image */}
      <ImageBackground
        source={item.imageUri ? { uri: item.imageUri } : undefined}
        style={StyleSheet.absoluteFill}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.75)'] as [string, string]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* Icon + label */}
      <View style={styles.itemContent}>
        <View style={styles.iconWrap}>
          <Icon size={22} color={theme.colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={styles.itemLabel} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    height: ITEM_SIZE,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
    justifyContent: 'flex-end',
  },
  itemContent: {
    padding: 14,
    gap: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryAlpha[10],
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[35],
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
  },
});
