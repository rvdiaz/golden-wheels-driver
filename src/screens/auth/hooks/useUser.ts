import { useLazyQuery, useMutation } from '@apollo/client';
import { addCustomerMutation, updateCustomerMutation } from '../graphql/mutations';
import { getCustomerQuery } from '../graphql/queries';
import { IUser } from '~/store/user/interfaces';

export const useUser = () => {
  const [updateCustomerFn, { loading: loadingUpdate }] = useMutation<{ updateCustomer: IUser }>(
    updateCustomerMutation
  );
  const [addCustomerFn, { loading: loadingAddition }] = useMutation<{
    addCustomer: IUser;
  }>(addCustomerMutation);
  const [getCustomerFn, { loading: loadingLoadUser }] = useLazyQuery<{ getCustomer: IUser }>(
    getCustomerQuery
  );

  return {
    updateCustomerFn,
    getCustomerFn,
    addCustomerFn,
    loadingLoadUser,
    loadingUpdate,
    loadingAddition,
  };
};
