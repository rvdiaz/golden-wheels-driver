import { ENV_Vars } from '~/store/env';

/**
 * The unread badge takes no driver id — the server resolves the caller's own mailbox from their
 * token. The previous version passed `tenantId: ''` and the user's id, which is why the badge
 * never showed a count.
 */
export const getMyUnreadCountVariables = () => ({
  organizationID: ENV_Vars.ORGANIZATION_ID,
});
