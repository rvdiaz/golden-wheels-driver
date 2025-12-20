import { IImage, IPrices } from '~/codidge_components/interfaces';

export interface IExternalReference {
  id: string;
  source: string;
}

export interface IModifierGroup {
  modifiersGroupID: string;
  name: string;
  description?: string;
  isRequired: boolean;
  maxSelections?: number;
  minSelections?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface IModifier {
  modifierID: string;
  name: string;
  price: IPrices;
  description?: string;
  modifiedTime: string;
  deleted: boolean;
  modifierGroupIds: string[];
  image?: IImage;
  externalReference?: IExternalReference;
  isActive: boolean;
}

export enum ModalContentType {
  EDIT = 'edit',
  ADD = 'add',
  DELETE = 'delete',
}

export interface ModifierFormData {
  name: string;
  price: string;
  description?: string;
  isActive: boolean;
}

export interface ModifierGroupFormData {
  name: string;
  description?: string;
}
