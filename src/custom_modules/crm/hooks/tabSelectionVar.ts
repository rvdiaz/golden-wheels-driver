import { makeVar } from '@apollo/client';
import { ActiveCrmTabs, ContactCategory, ContactSort } from '../interfaces';

// Default to today
export const crmTabSelection = makeVar<ActiveCrmTabs>(ActiveCrmTabs.contact);
export const crmSearhInput = makeVar<string>('');

export const selectedFiltersVar = makeVar<Set<ContactCategory>>(new Set());
export const selectedSortVar = makeVar<ContactSort>(ContactSort.NAME_ASC);
