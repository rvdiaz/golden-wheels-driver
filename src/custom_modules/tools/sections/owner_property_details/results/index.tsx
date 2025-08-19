import React from 'react';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { Owner } from './owner';
import { MlsHistoryList } from './mlsHistory';

export const PropertyOwnerResults = ({ propertyData }: { propertyData: IProperty }) => {
  return (
    <>
      <Property propertyData={propertyData} />
      <Owner ownerInfo={propertyData.ownerInfo} />
      {propertyData?.mlsHistory?.length > 0 && (
        <MlsHistoryList mlsHistory={propertyData.mlsHistory} />
      )}
    </>
  );
};
