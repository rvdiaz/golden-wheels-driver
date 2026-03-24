import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';

const durationOptions = Array.from({ length: 23 }, (_, i) => {
  const hour = i + 2;
  return { value: hour, label: `${hour} ${hour === 1 ? 'hour' : 'hours'}` };
});

/** Duration chip selector for hourly mode */
export const DurationPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <View style={dur.wrapper}>
    <Text style={dur.label}>Duration</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={dur.scroll}>
      {durationOptions.map((opt) => {
        const active = value === opt.value;
        return (
          <TouchableOpacity key={opt.value} onPress={() => onChange(opt.value)} activeOpacity={0.7}>
            {active ? (
              <LinearGradient
                colors={['#D4A853', '#C49440']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={dur.chip}>
                <Text style={[dur.chipLabel, dur.chipLabelActive]}>{opt.label}</Text>
              </LinearGradient>
            ) : (
              <View style={[dur.chip, dur.chipInactive]}>
                <Text style={dur.chipLabel}>{opt.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const dur = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.18)',
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  chipLabelActive: {
    color: '#0a0a0a',
  },
});
