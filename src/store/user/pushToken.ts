import { makeVar } from '@apollo/client';

export const pushTokenVar = makeVar<string>('');

export const setPushToken = (token: string) => pushTokenVar(token);
