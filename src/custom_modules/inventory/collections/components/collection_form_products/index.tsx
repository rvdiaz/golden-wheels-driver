import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Controller, Control, FieldErrors, useWatch } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { CollectionFormData } from '../../interfaces';
import { listProductsQuery } from '~/custom_modules/inventory/products/api/queries';
import { IProduct } from '~/custom_modules/inventory/products/interfaces';

interface CollectionFormProductsProps {
  control: Control<CollectionFormData>;
  errors: FieldErrors<CollectionFormData>;
  tenantID: string;
}

export const CollectionFormProducts: React.FC<CollectionFormProductsProps> = ({
  control,
  tenantID,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all products
  const { data, loading } = useQuery(listProductsQuery, {
    variables: { tenantID },
    fetchPolicy: 'cache-and-network',
  });

  const products: IProduct[] = data?.listProduct || [];

  // Watch selected product IDs
  const selectedProductIDs = useWatch({
    control,
    name: 'productIDs',
  });

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  const selectedCount = selectedProductIDs?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Products</Text>
        <Text style={styles.subtitle}>
          {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Product List */}
      <Controller
        control={control}
        name="productIDs"
        render={({ field: { onChange, value } }) => (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.productID}
            style={styles.productList}
            ListEmptyComponent={
              loading ? (
                <Text style={styles.emptyText}>Loading products...</Text>
              ) : (
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No products found' : 'No products available'}
                </Text>
              )
            }
            renderItem={({ item }) => {
              const isSelected = value?.includes(item.productID) || false;
              const principalImage = item.imageCatalog?.find((img) => img.principal)?.image;

              return (
                <TouchableOpacity
                  style={[styles.productItem, isSelected && styles.productItemSelected]}
                  onPress={() => {
                    const currentIDs = value || [];
                    if (isSelected) {
                      // Remove from selection
                      onChange(currentIDs.filter((id) => id !== item.productID));
                    } else {
                      // Add to selection
                      onChange([...currentIDs, item.productID]);
                    }
                  }}>
                  {principalImage && (
                    <Image
                      source={{ uri: principalImage.url }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.description && (
                      <Text style={styles.productDescription} numberOfLines={1}>
                        {item.description}
                      </Text>
                    )}
                    <Text style={styles.productPrice}>${item.basePrice.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.checkbox}>
                    {isSelected && (
                      <View style={styles.checkboxChecked}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                    {!isSelected && <View style={styles.checkboxUnchecked} />}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Products in this collection will be grouped together for easier browsing
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  clearIcon: {
    fontSize: 18,
    color: '#6B7280',
    paddingHorizontal: 8,
  },
  productList: {
    flex: 1,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  productItemSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  checkbox: {
    marginLeft: 12,
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 32,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
});
