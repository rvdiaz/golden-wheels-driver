import { IImage, IImageCatalogItem, IPrices, IQuantity } from '~/codidge_components/interfaces';

export interface IProduct {
  productID: string;
  tenantId: string;
  name: string;
  description: string;
  htmlDescription: string;
  sku: string;
  quantity: IQuantity;
  basePrice: IPrices;
  salePrice: IPrices;
  variants: IProductVariant[];
  variantOptions: IVariantOptions[];
  imageCatalog: IImageCatalogItem[];
  isActive: boolean;
  modifiersGroupIDs: string[];
  categoryIDs?: string[];
  metafield?: unknown;
  createdAt?: string;
}

export interface IProductVariant {
  variantID: string;
  variantName: string;
  image?: IImage;
  price?: IPrices;
  description: string;
  quantity: IQuantity;
  optionValues: IOptionItems[];
  isActive: boolean;
}

export interface IOptionItems {
  optionName: string;
  selectedValue: string;
}

export interface IVariantOptions {
  optionID: string;
  name: string;
  editionMode: boolean;
  options: {
    id: string;
    value: string;
    error?: string;
  }[];
}

export enum ModalContentProduct {
  EDIT = 'edit',
  ADD = 'add',
  DELETE = 'delete',
}

export enum ProductMenu {
  MAIN = 'Main',
  PRICING = 'Pricing',
  VARIANTS = 'Variants',
  MODIFIERS = 'Modifiers Groups',
  METAFIELDS = 'Metafields',
}

// Form Data Interfaces
export interface ProductMainFormData {
  name: string;
  description: string;
  htmlDescription?: string;
  sku?: string;
  isActive: boolean;
}

export interface ProductPricingFormData {
  basePrice: string;
  salePrice?: string;
  currencyCode: string;
}

export interface ProductQuantityFormData {
  unlimited: boolean;
  availableQuantity: number;
}

export interface ProductFormData extends ProductMainFormData, ProductPricingFormData {
  quantity: ProductQuantityFormData;
  categoryIDs: string[];
  modifiersGroupIDs: string[];
  imageCatalog: IImageCatalogItem[];
  variants: IProductVariant[];
  variantOptions: IVariantOptions[];
}

export interface VariantFormData {
  variantName: string;
  price?: string;
  unlimited: boolean;
  availableQuantity: number;
  isActive: boolean;
  optionValues: IOptionItems[];
}

export interface TenantData {
  tenantID: string;
  storeID?: string;
}
