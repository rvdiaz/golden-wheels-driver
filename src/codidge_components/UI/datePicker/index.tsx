import React, { useState, useEffect, useRef, JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type DatePickerMode = 'day' | 'week' | 'month';

interface DatePickerWidgetProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  mode?: DatePickerMode;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  inactiveTextColor?: string;
  selectedTextColor?: string;
  containerStyle?: ViewStyle;
  dayModeLabelTextStyle?: TextStyle;
  dateTextStyle?: TextStyle;
  dateTextStyleSelectionStyleContainer?: TextStyle;
}

interface MonthDayData {
  date: Date;
  isCurrentMonth: boolean;
}

interface MonthData {
  month: Date;
  days: MonthDayData[];
}

const DatePickerWidget: React.FC<DatePickerWidgetProps> = ({
  onDateSelect,
  initialDate = new Date(),
  mode = 'week',
  primaryColor = '#007AFF',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  inactiveTextColor = '#999999',
  selectedTextColor = '#FFFFFF',
  containerStyle = {},
  dayModeLabelTextStyle = {},
  dateTextStyle = {},
  dateTextStyleSelectionStyleContainer = {},
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const scrollViewRef = useRef<ScrollView>(null);

  const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Generate dates based on mode
  const generateDates = (): Date[] | Date[][] | MonthData[] => {
    const dates: any[] = [];

    if (mode === 'day') {
      // Generate 60 days (30 before, 30 after current date) for more scrollable content
      for (let i = 0; i <= 60; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        dates.push(date);
      }
    } else if (mode === 'week') {
      // Generate 5 weeks (2 before, current, 2 after)
      for (let weekOffset = -2; weekOffset <= 2; weekOffset++) {
        const weekDates: Date[] = [];
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - dayOfWeek + weekOffset * 7);

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + dayOffset);
          weekDates.push(date);
        }
        dates.push(weekDates);
      }
    } else if (mode === 'month') {
      // Generate 3 months (1 before, current, 1 after)
      for (let monthOffset = -1; monthOffset <= 1; monthOffset++) {
        const monthData: MonthDayData[] = [];
        const firstDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + monthOffset,
          1
        );
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + monthOffset + 1,
          0
        );

        // Add days from previous month to fill the first week
        const firstDayOfWeek = firstDay.getDay();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          const date = new Date(firstDay);
          date.setDate(date.getDate() - i - 1);
          monthData.push({ date, isCurrentMonth: false });
        }

        // Add all days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
          monthData.push({ date, isCurrentMonth: true });
        }

        // Add days from next month to fill the last week
        const remainingDays = 42 - monthData.length; // 6 weeks * 7 days
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(lastDay);
          date.setDate(lastDay.getDate() + i);
          monthData.push({ date, isCurrentMonth: false });
        }

        dates.push({ month: firstDay, days: monthData });
      }
    }

    return dates;
  };

  const dates = generateDates();

  const handleDatePress = (date: Date): void => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isSelectedDate = (date: Date): boolean => {
    return selectedDate.toDateString() === date.toDateString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const renderDayMode = (): JSX.Element => (
    <View>
      <Text style={[styles.monthYearText, { color: textColor, ...dayModeLabelTextStyle }]}>
        {months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
      </Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayContainer}
        snapToInterval={55}
        decelerationRate="fast">
        {(dates as Date[]).map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              isSelectedDate(date) && {
                borderWidth: 1,
                borderColor: primaryColor,
                borderRadius: 32,
                paddingVertical: 2,
              },
              isToday(date) &&
                !isSelectedDate(date) && {
                  borderColor: primaryColor,
                  borderWidth: 1,
                  borderRadius: 24,
                },
            ]}
            onPress={() => handleDatePress(date)}>
            <Text
              style={[
                styles.dayText,
                { color: isSelectedDate(date) ? selectedTextColor : textColor },
                !isSelectedDate(date) && isToday(date) && { color: textColor },
              ]}>
              {weekDays[date.getDay()]}
            </Text>
            <View style={isSelectedDate(date) ? dateTextStyleSelectionStyleContainer : {}}>
              <Text
                style={[
                  styles.dateText,
                  { color: isSelectedDate(date) ? selectedTextColor : textColor },
                  !isSelectedDate(date) && isToday(date) && { color: textColor },
                  dateTextStyle,
                ]}>
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderWeekMode = (): JSX.Element => (
    <View>
      <View style={styles.weekHeader}>
        <TouchableOpacity onPress={() => navigateWeek(-1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: primaryColor }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthYearText, { color: textColor }]}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => navigateWeek(1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: primaryColor }]}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekContainer}
        snapToInterval={screenWidth}
        decelerationRate="fast">
        {(dates as Date[][]).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.weekDayItem,
                  isSelectedDate(date) && { backgroundColor: primaryColor },
                  isToday(date) &&
                    !isSelectedDate(date) && { borderColor: primaryColor, borderWidth: 1 },
                ]}
                onPress={() => handleDatePress(date)}>
                <Text
                  style={[
                    styles.weekDayText,
                    { color: isSelectedDate(date) ? selectedTextColor : textColor },
                    !isSelectedDate(date) && isToday(date) && { color: primaryColor },
                  ]}>
                  {weekDays[date.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.weekDateText,
                    { color: isSelectedDate(date) ? selectedTextColor : textColor },
                    !isSelectedDate(date) && isToday(date) && { color: primaryColor },
                  ]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderMonthMode = (): JSX.Element => (
    <View>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: primaryColor }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthYearText, { color: textColor }]}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: primaryColor }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={[styles.weekdayHeaderText, { color: inactiveTextColor }]}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        decelerationRate="fast">
        {(dates as MonthData[]).map((monthData, monthIndex) => (
          <View key={monthIndex} style={styles.monthContainer}>
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <View key={weekIndex} style={styles.monthWeekRow}>
                {monthData.days
                  .slice(weekIndex * 7, (weekIndex + 1) * 7)
                  .map((dayData, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.monthDayItem,
                        isSelectedDate(dayData.date) && { backgroundColor: primaryColor },
                        isToday(dayData.date) &&
                          !isSelectedDate(dayData.date) && {
                            borderColor: primaryColor,
                            borderWidth: 1,
                          },
                      ]}
                      onPress={() => handleDatePress(dayData.date)}>
                      <Text
                        style={[
                          styles.monthDayText,
                          { color: dayData.isCurrentMonth ? textColor : inactiveTextColor },
                          isSelectedDate(dayData.date) && { color: selectedTextColor },
                          !isSelectedDate(dayData.date) &&
                            isToday(dayData.date) && { color: primaryColor },
                        ]}>
                        {dayData.date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      {mode === 'day' && renderDayMode()}
      {mode === 'week' && renderWeekMode()}
      {mode === 'month' && renderMonthMode()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  // Day Mode Styles
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dayContainer: {
    flexDirection: 'row',
  },
  dayItem: {
    width: 50,
    height: 65,
    marginHorizontal: 2.5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Week Mode Styles
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weekContainer: {
    paddingHorizontal: 8,
  },
  weekRow: {
    flexDirection: 'row',
    width: screenWidth - 32,
    justifyContent: 'space-around',
  },
  weekDayItem: {
    width: 45,
    height: 70,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  weekDateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Month Mode Styles
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    width: (screenWidth - 32) / 7,
    textAlign: 'center',
  },
  monthContainer: {
    width: screenWidth - 32,
  },
  monthWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  monthDayItem: {
    width: (screenWidth - 32) / 7 - 4,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  monthDayText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DatePickerWidget;
