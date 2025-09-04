import { makeVar } from '@apollo/client';
import { ActiveCrmTabs, ContactCategory } from '../interfaces';

// Default to today
export const crmTabSelection = makeVar<ActiveCrmTabs>(ActiveCrmTabs.lead);
export const crmSearhInput = makeVar<string>('');

export const selectedFiltersVar = makeVar<Set<ContactCategory>>(new Set());
export const selectedSortVar = makeVar<string | null>(null);
