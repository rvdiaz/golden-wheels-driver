import { makeVar } from '@apollo/client';

/**
 * The set of tabs, declared once.
 *
 * This union used to be re-typed by hand in three files — here, in the tab bar,
 * and in the navigator's SCREENS record — so adding a tab meant finding all
 * three or getting a type error at the seam between them. The bar and the
 * navigator now import this.
 */
export type TabName = 'Home' | 'Trips' | 'Earnings' | 'Notifications' | 'Account';

export const activeTabVar = makeVar<TabName>('Home');

export const setActiveTab = (tab: TabName) => {
  activeTabVar(tab);
};
