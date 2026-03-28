import { makeVar } from '@apollo/client';

export type TabName = 'Home' | 'Trips' | 'Notifications' | 'Account';

export const activeTabVar = makeVar<TabName>('Home');

export const setActiveTab = (tab: TabName) => {
  activeTabVar(tab);
};
