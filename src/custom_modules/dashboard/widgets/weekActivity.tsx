import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs } from 'react-native-svg';

const weeklyActivityData = [
  {
    name: 'Calls Made',
    value: 35,
    color: '#FF718B',
    total: 147,
  },
  {
    name: 'Tasks Completed',
    value: 28,
    color: '#FCB5C3',
    total: 85,
  },
  {
    name: 'Meetings',
    value: 20,
    color: '#FFEB3A',
    total: 12,
  },
  {
    name: 'Follow-ups',
    value: 17,
    color: '#7FE47E',
    total: 23,
  },
];

const totalActivityScore = weeklyActivityData.reduce((sum, item) => sum + item.value, 0);

export const WeeklyActivityChart = () => {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg height="180" width="180" style={styles.chartSvg}>
          <Defs>
            {/* Background circle */}
            <Circle
              stroke="#F3F4F6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={90}
              cy={90}
            />

            {/* Activity arcs */}
            {weeklyActivityData.map((item, index) => {
              const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
              const strokeDashoffset = circumference - (index * circumference) / 4;

              return (
                <Circle
                  key={index}
                  stroke={item.color}
                  fill="transparent"
                  strokeWidth={strokeWidth - 2}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  r={normalizedRadius - index * 3}
                  cx={90}
                  cy={90}
                  transform={`rotate(-90 90 90)`}
                />
              );
            })}
          </Defs>
        </Svg>

        {/* Center content */}
        <View style={styles.chartCenter}>
          <Text style={styles.chartScore}>{totalActivityScore}</Text>
          <Text style={styles.chartLabel}>This week's activity</Text>
          <Text style={styles.chartDate}>Aug 1-7, 2024</Text>
        </View>
      </View>
      <View style={styles.activityLegend}>
        {weeklyActivityData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendItemLeft}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendName}>{item.name}</Text>
            </View>
            <View style={styles.legendItemRight}>
              <Text style={styles.legendTotal}>{item.total}</Text>
              <Text style={styles.legendPercentage}>({item.value}%)</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  chartSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  chartDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  activityLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  legendItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendName: {
    fontSize: 12,
    color: '#374151',
  },
  legendItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});
