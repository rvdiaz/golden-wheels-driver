import { ReactNode } from 'react';

export interface IColumnConfig {
  header: string;
  accessor: string;
  size?: number;
  type?: DataTableType;
  visible?: boolean;
}

export enum DataTableType {
  text,
  widget,
}

interface ITableCell<T = unknown> {
  widgetToShow?: React.ReactNode;
  value: T;
}

export interface ITableRow {
  [key: string]: ITableCell;
}

export interface IMobileTableConfig {
  columns: IColumnConfig[];
  tableData: ITableRow[];
  onRowClick?: (row: ITableRow) => void;
  rowLoadingIds?: string[];
  title: string;
  titleRightActions?: ReactNode;
  footer?: ReactNode;
  allowRowSelection?: boolean;
  allowSearch?: boolean;
  singleRowSelection?: boolean;
  loadingTableBody?: boolean;
  onSelectionChange?: (selectedRows: ITableRow[]) => void;
  cellsPadding?: number;
}
