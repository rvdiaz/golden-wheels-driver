import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { DataTableType, ITableRow } from '../interfaces';

export const renderCellContent = (row: ITableRow, col: any) => {
  const colType = col.type ?? DataTableType.text;

  switch (colType) {
    case DataTableType.text:
      return (
        <Text style={{ fontSize: 14, color: '#111827' }}>
          {row[col.accessor].widgetToShow as ReactNode}
        </Text>
      );
    case DataTableType.widget:
      return <View>{row[col.accessor].widgetToShow}</View>;
    default:
      return <Text style={{ fontSize: 14, color: '#9CA3AF' }}>-</Text>;
  }
};
