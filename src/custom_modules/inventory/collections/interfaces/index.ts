import { IImageCatalogItem } from '~/codidge_components/interfaces';
import { IProduct } from '../../products/interfaces';

export interface ICollection {
  categoryID: string;
  name: string;
  description: string;
  htmlDescription: string;
  imageCatalog: IImageCatalogItem[];
  productIDs: string[];
  isActive: boolean;
  products: IProduct[];
  metafield?: { [key: string]: any };
}

export enum ModalContentCollection {
  EDIT = 'edit',
  ADD = 'add',
  DELETE = 'delete',
}

export enum CollectionMenu {
  MAIN = 'Main',
  PRODUCTS = 'Products',
}

// Form Data Interfaces
export interface CollectionMainFormData {
  name: string;
  description: string;
  htmlDescription?: string;
  isActive: boolean;
}

export interface CollectionProductsFormData {
  productIDs: string[];
}

export interface CollectionFormData extends CollectionMainFormData, CollectionProductsFormData {
  imageCatalog: IImageCatalogItem[];
}

export interface ProductSelectionItem {
  productID: string;
  name: string;
  description?: string;
  imageCatalog?: IImageCatalogItem[];
  selected: boolean;
}
