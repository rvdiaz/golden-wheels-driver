import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { ICollection } from '../../interfaces';

interface CollectionCardProps {
  collection: ICollection;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onPress?: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onToggleAvailability,
  onPress,
}) => {
  const principalImage = collection.imageCatalog?.find((img) => img.principal)?.image;
  const productCount = collection.products?.length || collection.productIDs?.length || 0;

  return (
    <TouchableOpacity
      style={[styles.card, !collection.isActive && styles.cardInactive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        {principalImage && (
          <Image source={{ uri: principalImage.url }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.info}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.name} numberOfLines={2}>
                {collection.name}
              </Text>
              {collection.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {collection.description}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.metadata}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {productCount} {productCount === 1 ? 'Product' : 'Products'}
              </Text>
            </View>
          </View>

          {/* Product Preview */}
          {collection.products && collection.products.length > 0 && (
            <View style={styles.productPreview}>
              <Text style={styles.productPreviewLabel}>Products:</Text>
              <View style={styles.productList}>
                {collection.products.slice(0, 3).map((product, index) => (
                  <Text key={product.productID} style={styles.productName} numberOfLines={1}>
                    {index > 0 && '• '}
                    {product.name}
                  </Text>
                ))}
                {collection.products.length > 3 && (
                  <Text style={styles.productMore}>+{collection.products.length - 3} more</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>
            {collection.isActive ? 'Active' : 'Inactive'}
          </Text>
          <Switch
            value={collection.isActive}
            onValueChange={onToggleAvailability}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardInactive: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
  },
  productPreview: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  productPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  productName: {
    fontSize: 12,
    color: '#374151',
  },
  productMore: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
