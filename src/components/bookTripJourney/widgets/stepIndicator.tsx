import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';

// ─── Step indicator ───────────────────────────────────────────────────────────
const GOLD = theme.colors.primary;

export const StepIndicator = ({
  current,
  total,
}: {
  current: number; // 0-indexed
  total: number;
}) => {
  return (
    <View style={ind.row}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            {/* Segment line before each dot (except first) */}
            {i > 0 && <View style={[ind.line, (done || active) && ind.lineActive]} />}
            {/* Dot */}
            <View style={[ind.dot, active && ind.dotActive, done && ind.dotDone]}>
              {done && <View style={ind.dotCheck} />}
              {active && <View style={ind.dotInner} />}
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const ind = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(212,168,83,0.15)',
    maxWidth: 40,
  },
  lineActive: {
    backgroundColor: GOLD,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderColor: GOLD,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotDone: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  dotCheck: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#020617',
  },
});
