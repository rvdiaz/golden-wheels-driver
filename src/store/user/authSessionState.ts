import { makeVar } from '@apollo/client';

export const authenticatedUser = makeVar<boolean>(false);

export const updateAuthenticateStateUser = async (authState: boolean) => {
  authenticatedUser(authState);
};
