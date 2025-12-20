import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MobileDataTable from '~/codidge_components/UI/datatable';
import {
  DataTableType,
  IColumnConfig,
  ITableRow,
} from '~/codidge_components/UI/datatable/interfaces';

// Example: Product List
export function ProductListExample() {
  const [selectedProducts, setSelectedProducts] = useState<ITableRow[]>([]);

  const columns: IColumnConfig[] = [
    {
      header: 'Product Name',
      accessor: 'name',
      type: DataTableType.text,
      size: 180,
    },
    {
      header: 'SKU',
      accessor: 'sku',
      type: DataTableType.text,
      size: 100,
    },
    {
      header: 'Price',
      accessor: 'price',
      type: DataTableType.widget,
      size: 100,
    },
    {
      header: 'Stock',
      accessor: 'stock',
      type: DataTableType.widget,
      size: 120,
    },
    {
      header: 'Status',
      accessor: 'status',
      type: DataTableType.widget,
      size: 100,
    },
  ];

  const tableData: ITableRow[] = [
    {
      id: { value: '1' },
      name: {
        value: 'Wireless Headphones',
        widgetToShow: <Text style={styles.cellText}>Wireless Headphones</Text>,
      },
      sku: {
        value: 'WH-001',
        widgetToShow: <Text style={styles.cellText}>WH-001</Text>,
      },
      price: {
        value: 99.99,
        widgetToShow: <Text style={styles.priceText}>$99.99</Text>,
      },
      stock: {
        value: 45,
        widgetToShow: (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>45 units</Text>
          </View>
        ),
      },
      status: {
        value: 'active',
        widgetToShow: (
          <View style={[styles.badge, styles.activeBadge]}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        ),
      },
    },
    {
      id: { value: '2' },
      name: {
        value: 'Smart Watch',
        widgetToShow: <Text style={styles.cellText}>Smart Watch</Text>,
      },
      sku: {
        value: 'SW-002',
        widgetToShow: <Text style={styles.cellText}>SW-002</Text>,
      },
      price: {
        value: 199.99,
        widgetToShow: <Text style={styles.priceText}>$199.99</Text>,
      },
      stock: {
        value: 12,
        widgetToShow: (
          <View style={[styles.stockBadge, styles.lowStock]}>
            <Text style={styles.stockText}>12 units</Text>
          </View>
        ),
      },
      status: {
        value: 'active',
        widgetToShow: (
          <View style={[styles.badge, styles.activeBadge]}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        ),
      },
    },
    {
      id: { value: '3' },
      name: {
        value: 'Laptop Stand',
        widgetToShow: <Text style={styles.cellText}>Laptop Stand</Text>,
      },
      sku: {
        value: 'LS-003',
        widgetToShow: <Text style={styles.cellText}>LS-003</Text>,
      },
      price: {
        value: 49.99,
        widgetToShow: <Text style={styles.priceText}>$49.99</Text>,
      },
      stock: {
        value: 0,
        widgetToShow: (
          <View style={[styles.stockBadge, styles.outOfStock]}>
            <Text style={styles.stockText}>Out of stock</Text>
          </View>
        ),
      },
      status: {
        value: 'inactive',
        widgetToShow: (
          <View style={[styles.badge, styles.inactiveBadge]}>
            <Text style={styles.badgeText}>Inactive</Text>
          </View>
        ),
      },
    },
  ];

  const handleRowClick = (row: ITableRow) => {
    console.log('Clicked row:', row.name.value);
  };

  const handleSelectionChange = (selected: ITableRow[]) => {
    setSelectedProducts(selected);
    console.log('Selected products:', selected.length);
  };

  return (
    <View style={styles.container}>
      <MobileDataTable
        columns={columns}
        tableData={tableData}
        title="Products"
        allowSearch={true}
        allowRowSelection={true}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        titleRightActions={
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        }
        footer={
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              {selectedProducts.length} selected • {tableData.length} total products
            </Text>
          </View>
        }
      />
    </View>
  );
}

// Example: Customer List
export function CustomerListExample() {
  const columns: IColumnConfig[] = [
    {
      header: 'Customer Name',
      accessor: 'name',
      type: DataTableType.text,
      size: 180,
    },
    {
      header: 'Email',
      accessor: 'email',
      type: DataTableType.text,
      size: 200,
    },
    {
      header: 'Total Orders',
      accessor: 'orders',
      type: DataTableType.widget,
      size: 120,
    },
    {
      header: 'Status',
      accessor: 'status',
      type: DataTableType.widget,
      size: 100,
    },
  ];

  const tableData: ITableRow[] = [
    {
      id: { value: '1' },
      name: {
        value: 'John Doe',
        widgetToShow: <Text style={styles.cellText}>John Doe</Text>,
      },
      email: {
        value: 'john@example.com',
        widgetToShow: <Text style={styles.cellText}>john@example.com</Text>,
      },
      orders: {
        value: 24,
        widgetToShow: <Text style={{ fontWeight: '600', color: '#3B82F6' }}>24 orders</Text>,
      },
      status: {
        value: 'premium',
        widgetToShow: (
          <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.badgeText, { color: '#92400E' }]}>Premium</Text>
          </View>
        ),
      },
    },
    {
      id: { value: '2' },
      name: {
        value: 'Jane Smith',
        widgetToShow: <Text style={styles.cellText}>Jane Smith</Text>,
      },
      email: {
        value: 'jane@example.com',
        widgetToShow: <Text style={styles.cellText}>jane@example.com</Text>,
      },
      orders: {
        value: 8,
        widgetToShow: <Text style={{ fontWeight: '600', color: '#3B82F6' }}>8 orders</Text>,
      },
      status: {
        value: 'regular',
        widgetToShow: (
          <View style={[styles.badge, { backgroundColor: '#E0E7FF' }]}>
            <Text style={[styles.badgeText, { color: '#3730A3' }]}>Regular</Text>
          </View>
        ),
      },
    },
  ];

  return (
    <View style={styles.container}>
      <MobileDataTable
        columns={columns}
        tableData={tableData}
        title="Customers"
        allowSearch={true}
        onRowClick={(row) => console.log('Customer clicked:', row.name.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  cellText: {
    fontSize: 14,
    color: '#111827',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
    alignSelf: 'flex-start',
  },
  lowStock: {
    backgroundColor: '#FED7AA',
  },
  outOfStock: {
    backgroundColor: '#FECACA',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
