import { makeVar } from '@apollo/client';

import moment from 'moment';

// Default to today
export const daySelection = makeVar<string>(moment().format('YYYY-MM-DD'));
