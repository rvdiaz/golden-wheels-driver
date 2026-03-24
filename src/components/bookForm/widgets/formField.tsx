import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Text from '~/codidge_components/UI/text';

/** A tappable location/date field row */
export const FormField = ({
  label,
  value,
  placeholder,
  icon,
  onPress,
  error,
  style,
}: {
  label: string;
  value?: string;
  placeholder: string;
  icon: React.ReactNode;
  onPress: () => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[field.wrapper, style]}>
    <Text style={field.label}>{label}</Text>
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={field.row}>
      <LinearGradient
        colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[field.gradient, error ? field.gradientError : null]}>
        <View style={field.iconWrap}>{icon}</View>
        <Text style={[field.valueText, !value && field.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronRight size={20} color="rgba(212,168,83,0.5)" />
      </LinearGradient>
    </TouchableOpacity>
    {error ? <Text style={field.error}>{error}</Text> : null}
  </View>
);

const field = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  row: {
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    gap: 10,
  },
  gradientError: {
    borderColor: 'rgba(239,68,68,0.6)',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  placeholder: {
    color: 'rgba(255,255,255,0.4)',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
  },
});
