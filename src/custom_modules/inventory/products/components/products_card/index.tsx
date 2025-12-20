import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { IProduct } from '../../interfaces';

interface ProductCardProps {
  product: IProduct;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
  onPress,
}) => {
  const principalImage = product.imageCatalog?.find((img) => img.principal)?.image;
  const hasVariants = product.variants && product.variants.length > 0;
  const isOnSale = product.salePrice && product.salePrice.amount < product.basePrice.amount;

  return (
    <TouchableOpacity
      style={[styles.card, !product.isActive && styles.cardInactive]}
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
                {product.name}
              </Text>
              {product.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {product.description}
                </Text>
              )}
            </View>

            <View style={styles.headerRight}>
              {isOnSale && (
                <Text style={styles.originalPrice}>${product.basePrice.amount.toFixed(2)}</Text>
              )}
              <Text style={styles.price}>
                ${(isOnSale ? product.salePrice.amount : product.basePrice.amount).toFixed(2)}
              </Text>
              {isOnSale && (
                <View style={styles.saleBadge}>
                  <Text style={styles.saleBadgeText}>SALE</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.metadata}>
            {hasVariants && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{product.variants.length} Variants</Text>
              </View>
            )}
            {product.quantity.unlimited ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Unlimited Stock</Text>
              </View>
            ) : (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Stock: {product.quantity.availableQuantity}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>
            {product.isActive ? 'Available' : 'Unavailable'}
          </Text>
          <Switch
            value={product.isActive}
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
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  saleBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  metadata: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
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
