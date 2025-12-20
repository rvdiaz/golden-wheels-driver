import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { IProduct, ProductFormData } from '../interfaces';
import { listProductsQuery } from '../api/queries';
import {
  createProductMutation,
  deleteProductMutation,
  updateProductsMutation,
} from '../api/mutation';

interface UseProductsProps {
  tenantID: string;
}

export const useProducts = ({ tenantID }: UseProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(listProductsQuery, {
    variables: { tenantID },
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createProduct, { loading: creating }] = useMutation(createProductMutation);
  const [updateProduct, { loading: updating }] = useMutation(updateProductsMutation);
  const [deleteProduct, { loading: deleting }] = useMutation(deleteProductMutation);

  const products: IProduct[] = data?.listProduct || [];

  const handleCreateProduct = async (formData: ProductFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
        htmlDescription: formData.htmlDescription || '',
        basePrice: {
          amount: parseFloat(formData.basePrice),
          currencyCode: formData.currencyCode || 'USD',
        },
        salePrice: formData.salePrice
          ? {
              amount: parseFloat(formData.salePrice),
              currencyCode: formData.currencyCode || 'USD',
            }
          : null,
        quantity: {
          unlimited: formData.quantity.unlimited,
          availableQuantity: formData.quantity.unlimited ? 0 : formData.quantity.availableQuantity,
        },
        isActive: formData.isActive,
        categoryIDs: formData.categoryIDs || [],
        modifiersGroupIDs: formData.modifiersGroupIDs || [],
        imageCatalog: formData.imageCatalog || [],
        variants: formData.variants || [],
        variantOptions: formData.variantOptions || [],
      };

      await createProduct({
        variables: { tenantID, input },
        refetchQueries: [{ query: listProductsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Product created successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to create product');
      console.error('Create product error:', err);
      return false;
    }
  };

  const handleUpdateProduct = async (productID: string, formData: ProductFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
        htmlDescription: formData.htmlDescription || '',
        basePrice: {
          amount: parseFloat(formData.basePrice),
          currencyCode: formData.currencyCode || 'USD',
        },
        salePrice: formData.salePrice
          ? {
              amount: parseFloat(formData.salePrice),
              currencyCode: formData.currencyCode || 'USD',
            }
          : null,
        quantity: {
          unlimited: formData.quantity.unlimited,
          availableQuantity: formData.quantity.unlimited ? 0 : formData.quantity.availableQuantity,
        },
        isActive: formData.isActive,
        categoryIDs: formData.categoryIDs || [],
        modifiersGroupIDs: formData.modifiersGroupIDs || [],
        imageCatalog: formData.imageCatalog || [],
        variants: formData.variants || [],
        variantOptions: formData.variantOptions || [],
      };

      await updateProduct({
        variables: { productID, tenantID, input },
        refetchQueries: [{ query: listProductsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Product updated successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to update product');
      console.error('Update product error:', err);
      return false;
    }
  };

  const handleDeleteProduct = async (productID: string) => {
    try {
      await deleteProduct({
        variables: { productID, tenantID },
        refetchQueries: [{ query: listProductsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Product deleted successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to delete product');
      console.error('Delete product error:', err);
      return false;
    }
  };

  const handleToggleAvailability = async (productID: string) => {
    const product = products.find((p) => p.productID === productID);
    if (!product) return false;

    try {
      const input = {
        isActive: !product.isActive,
      };

      await updateProduct({
        variables: { productID, tenantID, input },
        refetchQueries: [{ query: listProductsQuery, variables: { tenantID } }],
      });

      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle availability');
      console.error('Toggle availability error:', err);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    creating,
    updating,
    deleting,
    selectedProduct,
    setSelectedProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleAvailability,
    refetch,
  };
};
