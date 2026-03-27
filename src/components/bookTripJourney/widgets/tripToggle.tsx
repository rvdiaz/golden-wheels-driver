import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { BookMode } from '~/screens/trips/interfaces';

export const BookModeToggle = ({
  value,
  onChange,
}: {
  value: BookMode;
  onChange: (v: BookMode) => void;
}) => (
  <View style={toggle.wrapper}>
    {[
      { mode: BookMode.trip, label: 'One Trip' },
      { mode: BookMode.hourly, label: 'By Hour' },
    ].map(({ mode, label }) => {
      const active = value === mode;
      return (
        <TouchableOpacity
          key={mode}
          onPress={() => onChange(mode)}
          activeOpacity={0.8}
          style={toggle.tabWrapper}>
          {active ? (
            <LinearGradient
              colors={['#D4A853', '#C49440']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={toggle.tab}>
              <Text style={[toggle.label, toggle.labelActive]}>{label}</Text>
            </LinearGradient>
          ) : (
            <View style={[toggle.tab, toggle.tabInactive]}>
              <Text style={[toggle.label, toggle.labelInactive]}>{label}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const toggle = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.15)',
  },
  tabWrapper: {
    flex: 1,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#0a0a0a',
  },
  labelInactive: {
    color: 'rgba(255,255,255,0.45)',
  },
});
