import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { FilterFn } from '@tanstack/react-table';

import { IMobileTableConfig, ITableRow, DataTableType, IColumnConfig } from './interfaces';
import { Search } from 'lucide-react-native';
import { theme } from '~/theme/theme';

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId);
  return rankItem(String(cellValue), String(value)).passed;
};

export default function MobileDataTable({
  columns,
  tableData,
  onRowClick,
  rowLoadingIds = [],
  title,
  titleRightActions,
  footer,
  allowRowSelection = false,
  allowSearch = false,
  singleRowSelection = false,
  loadingTableBody = false,
  onSelectionChange,
  cellsPadding = 12,
}: IMobileTableConfig) {
  const columnHelper = createColumnHelper<unknown>();

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Build table columns
  const tableColumns = useMemo(() => {
    const cols: any[] = [];

    // Add selection column if needed
    if (allowRowSelection) {
      cols.push(
        columnHelper.display({
          id: '__row_selection__',
          header: () =>
            !singleRowSelection ? (
              <View style={styles.headerCheckboxContainer}>
                <TouchableOpacity
                  onPress={() => {
                    const allSelected = table.getIsAllRowsSelected();
                    table.toggleAllRowsSelected(!allSelected);
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      table.getIsAllRowsSelected() && styles.checkboxSelected,
                    ]}>
                    {table.getIsAllRowsSelected() && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            ) : null,
          cell: ({ row }) => (
            <View style={styles.cellCheckboxContainer}>
              <TouchableOpacity onPress={() => row.toggleSelected()}>
                <View style={[styles.checkbox, row.getIsSelected() && styles.checkboxSelected]}>
                  {row.getIsSelected() && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          ),
          size: 50,
        })
      );
    }

    // Add data columns
    columns
      .filter((col) => col.visible !== false)
      .forEach((colData: IColumnConfig) => {
        cols.push(
          columnHelper.accessor((row: any) => row[colData.accessor].value, {
            id: colData.accessor,
            enableGlobalFilter: true,
            filterFn: 'includesString',
            meta: {
              header: colData?.header ?? '',
              type: colData?.type ?? DataTableType.text,
              columnConfig: colData,
            },
            header: () => colData.header,
            cell: (info) => {
              const row = info.row.original as ITableRow;
              return row[colData.accessor].widgetToShow;
            },
            size: colData.size ?? 150,
          })
        );
      });

    return cols;
  }, [columns, allowRowSelection, singleRowSelection]);

  const table = useReactTable({
    columns: tableColumns as ColumnDef<unknown, unknown>[],
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    enableMultiRowSelection: !singleRowSelection,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        const selectedRows = Object.keys(newSelection)
          .filter((key) => newSelection[key])
          .map((key) => tableData[parseInt(key)]);
        onSelectionChange(selectedRows);
      }
    },
    enableRowSelection: allowRowSelection,
  });

  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerActions}>
          {allowSearch && (
            <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.iconButton}>
              <Search size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          {titleRightActions}
        </View>
      </View>

      {/* Search Bar */}
      {allowSearch && showSearch && (
        <View style={styles.searchContainer}>
          <Search size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${title}`}
            value={globalFilter}
            onChangeText={setGlobalFilter}
            placeholderTextColor="#9CA3AF"
          />
          {globalFilter.length > 0 && (
            <TouchableOpacity onPress={() => setGlobalFilter('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Table Content */}
      {loadingTableBody ? (
        <View style={styles.loadingTableContainer}>
          <ActivityIndicator size="large" color="#6B7280" />
        </View>
      ) : (
        <View style={styles.tableWrapper}>
          {/* Fixed Header */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.headerScrollContent}>
            <View>
              {headerGroups.map((headerGroup) => (
                <View key={headerGroup.id} style={styles.tableHeader}>
                  {headerGroup.headers.map((header) => (
                    <View
                      key={header.id}
                      style={[styles.tableHeaderCell, { width: header.column.getSize() }]}>
                      <Text style={styles.tableHeaderText}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Scrollable Body */}
          <ScrollView style={styles.tableBodyScroll} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
              <View>
                {rows.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No data available</Text>
                  </View>
                ) : (
                  rows.map((row) => {
                    const isRowSelected = row.getIsSelected();
                    const originalRow = row.original as ITableRow;
                    const rowId = originalRow.id?.value as string;
                    const isLoading = rowLoadingIds.includes(rowId);

                    return (
                      <TouchableOpacity
                        key={row.id}
                        style={[
                          styles.tableRow,
                          isRowSelected && styles.rowSelected,
                          isLoading && styles.rowLoading,
                        ]}
                        onPress={() => {
                          if (allowRowSelection && !isLoading) {
                            row.toggleSelected();
                          }
                          if (onRowClick && !isLoading) {
                            onRowClick(originalRow);
                          }
                        }}
                        disabled={isLoading}
                        activeOpacity={0.7}>
                        {isLoading ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color="#6B7280" />
                          </View>
                        ) : (
                          row.getVisibleCells().map((cell) => (
                            <View
                              key={cell.id}
                              style={[
                                styles.tableCell,
                                {
                                  width: cell.column.getSize(),
                                  paddingHorizontal: cellsPadding,
                                },
                              ]}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </View>
                          ))
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      )}

      {/* Footer */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 8,
  },
  clearButton: {
    fontSize: 18,
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },
  tableWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  headerScrollContent: {
    backgroundColor: 'red',
    maxHeight: 50,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  headerCheckboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableBodyScroll: {
    height: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  rowSelected: {
    backgroundColor: '#EFF6FF',
  },
  rowLoading: {
    opacity: 0.5,
  },
  loadingRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    paddingVertical: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  cellCheckboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minWidth: 300,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  loadingTableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});
