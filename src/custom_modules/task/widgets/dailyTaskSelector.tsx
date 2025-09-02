import React from 'react';
import { theme } from '~/theme/theme';
import { daySelection } from '../hooks/dailySelectionVar';
import DatePickerWidget from '~/codidge_components/UI/datePicker';
import moment from 'moment';

export const DailyTaskSelector = () => {
  return (
    <DatePickerWidget
      containerStyle={{
        paddingVertical: 4,
      }}
      mode="day"
      primaryColor={theme.colors.primary}
      backgroundColor={theme.colors.headerBackground}
      textColor="#FFF"
      onDateSelect={(selectedDay) => {
        const formattedDay = moment(selectedDay).format('YYYY-MM-DD');
        daySelection(formattedDay);
      }}
      dayModeLabelTextStyle={{
        color: '#A5B4FC',
        fontSize: 16,
        fontWeight: '500',
      }}
      dateTextStyleSelectionStyleContainer={{
        backgroundColor: theme.colors.primary,
        height: 35,
        width: 35,
        borderRadius: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      initialDate={new Date()}
    />
  );
};
