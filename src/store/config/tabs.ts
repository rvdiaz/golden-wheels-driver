import { makeVar } from '@apollo/client';
import { TabName } from '~/navigation/bottomBar';

export const postLoginRedirectVar = makeVar<TabName | null>(null);
