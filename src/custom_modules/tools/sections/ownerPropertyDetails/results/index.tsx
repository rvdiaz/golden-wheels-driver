import React from 'react';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { Owner } from './owner';

export const PropertyOwnerResults = ({ propertyData }: { propertyData: IProperty }) => {
  return (
    <>
      <Property propertyData={propertyData} />
      <Owner ownerInfo={propertyData.ownerInfo} />
    </>
  );
};
