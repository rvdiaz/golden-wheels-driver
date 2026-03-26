import { useLazyQuery, useMutation } from '@apollo/client';
import { addCustomerMutation, updateUserMutation } from '../graphql/mutations';
import { getCustomerQuery } from '../graphql/queries';
import { IUser } from '~/store/user/interfaces';

export const useUser = () => {
  const [updateUserFn, { loading: loadingUpdate }] = useMutation<{ updateUser: IUser }>(
    updateUserMutation
  );
  const [addCustomerFn, { loading: loadingAddition, error: errorAddingUser }] = useMutation<{
    addCustomer: IUser;
  }>(addCustomerMutation);
  const [getCustomerFn, { loading: loadingLoadUser, error }] = useLazyQuery<{ getCustomer: IUser }>(
    getCustomerQuery
  );

  return {
    updateUserFn,
    getCustomerFn,
    addCustomerFn,
    loadingLoadUser,
    loadingUpdate,
    loadingAddition,
  };
};
